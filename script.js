document.getElementById('year').textContent = String(new Date().getFullYear());

const launcher = document.getElementById('chat-launcher');
const dialog = document.getElementById('chat-dialog');
const form = document.getElementById('chat-form');
const question = document.getElementById('chat-question');
const messages = document.getElementById('chat-messages');
const status = document.getElementById('chat-status');
const send = document.getElementById('chat-send');
const reset = document.getElementById('chat-reset');
const suggestions = [...document.querySelectorAll('.chat-suggestions button')];
let history = [];
let pending = false;
let controller;
launcher.hidden = false;
launcher.addEventListener('click', () => { dialog.showModal(); question.focus(); });
document.getElementById('chat-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => launcher.focus());
document.getElementById('chat-background').addEventListener('click', () => dialog.close());
function addMessage(role, content) {
  const item = document.createElement('div');
  item.className = `chat-message chat-${role}`;
  const label = document.createElement('span');
  label.textContent = role === 'user' ? 'You' : 'AI assistant';
  const text = document.createElement('p');
  text.textContent = content;
  item.append(label, text);
  messages.append(item);
  return item;
}
function setPending(value) {
  pending = value;
  send.disabled = value;
  question.readOnly = value;
  reset.disabled = value;
  suggestions.forEach(button => { button.disabled = value; });
  send.textContent = value ? 'Waiting…' : 'Send ↗';
}
function scrollChat() { const body = dialog.querySelector('.chat-body'); body.scrollTop = body.scrollHeight; }
form.addEventListener('submit', async event => {
  event.preventDefault();
  const content = question.value.trim();
  if (pending || !content) return;
  const userMessage = addMessage('user', content);
  const input = [...history.slice(-10), { role: 'user', content }];
  status.textContent = 'Thinking…';
  question.value = '';
  setPending(true); scrollChat();
  controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: input }), signal: controller.signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Chat is unavailable. Please try again.');
    if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('The assistant couldn’t finish its answer. Please try again.');
    history = [...input, { role: 'assistant', content: data.reply }];
    addMessage('assistant', data.reply);
    status.textContent = '';
  } catch (error) {
    userMessage.remove();
    question.value = content;
    status.textContent = error.name === 'AbortError' ? 'That took too long. Your question is saved below; please try again.' : error instanceof TypeError || error instanceof SyntaxError ? 'Chat couldn’t connect. Please try again, or use LinkedIn below.' : error.message;
  } finally {
    clearTimeout(timeout); setPending(false); scrollChat();
  }
});
suggestions.forEach(button => button.addEventListener('click', () => {
  question.value = button.textContent;
  question.focus();
}));
question.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); form.requestSubmit(); }
});
reset.addEventListener('click', () => { history = []; messages.replaceChildren(); status.textContent = ''; question.value = ''; question.focus(); });
