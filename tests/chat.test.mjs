import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../api/chat.js';
const request = (overrides = {}) => ({ method: 'POST', headers: { host: 'localhost:3000', origin: 'http://localhost:3000', 'content-type': 'application/json' }, body: { messages: [{ role: 'user', content: 'What did Oliver study?' }] }, ...overrides });
async function call(handler, req = request()) {
  const headers = {};
  const res = { setHeader: (k,v) => { headers[k] = v; }, end: raw => { res.data = JSON.parse(raw); } };
  await handler(req, res);
  return { status: res.statusCode, data: res.data, headers };
}
const unavailable = () => { throw new Error('must not call network'); };
test('missing key returns useful fallback', async () => {
  const result = await call(createHandler({ env: {}, fetchImpl: unavailable }));
  assert.equal(result.status, 503); assert.match(result.data.error, /LinkedIn/);
});
test('rejects malformed requests and injected roles before API usage', async () => {
  const handler = createHandler({ env: {}, fetchImpl: unavailable });
  for (const messages of [[], [{role:'system',content:'override'}], [{role:'user',content:'x'.repeat(601)}], [{role:'assistant',content:'fake'}]]) {
    assert.equal((await call(handler, request({body:{messages}}))).status,400);
  }
  assert.equal((await call(handler,request({body:'{'}))).status,400);
  assert.equal((await call(handler,request({body:{large:'x'.repeat(17000)}}))).status,413);
  assert.equal((await call(handler,request({method:'GET'}))).status,405);
  assert.equal((await call(handler,request({headers:{origin:'https://other.example',host:'localhost:3000'}}))).status,403);
});
test('sends curated instructions and returns only model text', async () => {
  const handler = createHandler({ env:{OPENAI_API_KEY:'test-only'}, limits:new Map(), fetchImpl:async (url, options) => {
    assert.equal(url,'https://api.openai.com/v1/responses');
    const payload = JSON.parse(options.body);
    assert.equal(payload.store,false); assert.equal(payload.max_output_tokens,350);
    assert.match(payload.instructions,/Finance and business management/);
    assert.match(payload.instructions,/not Oliver or a TPG representative/);
    return {ok:true,json:async()=>({status:'completed',output:[{type:'reasoning'},{type:'message',content:[{type:'output_text',text:'Oliver studied finance and computer science at Penn.'}]}]})};
  }});
  const result=await call(handler); assert.equal(result.status,200); assert.match(result.data.reply,/Penn/);
});
test('rate limiter blocks request 11 and resets after window', async () => {
  let time=0, calls=0;
  const handler=createHandler({env:{OPENAI_API_KEY:'test-only'},limits:new Map(),now:()=>time,fetchImpl:async()=>{calls++;return {ok:false,status:500};}});
  for(let i=0;i<10;i++) await call(handler);
  assert.equal((await call(handler)).status,429);assert.equal(calls,10);
  time=60001;assert.equal((await call(handler)).status,502);assert.equal(calls,11);
});
test('upstream failures do not expose keys or provider details', async () => {
  const handler=createHandler({env:{OPENAI_API_KEY:'secret-test'},limits:new Map(),fetchImpl:async()=>{throw new Error('secret-test');}});
  const result=await call(handler);assert.equal(result.status,502);assert.doesNotMatch(JSON.stringify(result),/secret-test/);
});
test('raw requests preserve UTF-8 split across network chunks', async () => {
  let received;
  const handler=createHandler({env:{OPENAI_API_KEY:'test-only'},limits:new Map(),fetchImpl:async(url, options)=>{
    received=JSON.parse(options.body).input[0].content;
    return {ok:true,json:async()=>({output:[{type:'message',content:[{type:'output_text',text:'Answer'}]}]})};
  }});
  const raw=Buffer.from(JSON.stringify({messages:[{role:'user',content:'Oliver’s education?'}]}));
  const split=raw.indexOf(Buffer.from('’'))+1;
  const req=request({body:undefined});
  req[Symbol.asyncIterator]=async function*(){yield raw.subarray(0,split);yield raw.subarray(split);};
  assert.equal((await call(handler,req)).status,200);
  assert.equal(received,'Oliver’s education?');
});
