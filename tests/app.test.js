import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script, createContext } from 'node:vm';

const source = await readFile(new URL('../js/offline.js', import.meta.url), 'utf8');
const decode = value => value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

// A minimal event and element host for testing application orchestration.
// Browser layout, focus order and announcements still require browser review.
function launch({ unavailable = false, downloadFailure = false } = {}) {
  const elements = new Map();
  const data = new Map();
  const downloads = [];
  const callbacks = new Map();
  let focus = null;
  class Element {
    constructor(id = '', attributes = {}) {
      this.id = id; this.attributes = attributes; this.dataset = {};
      for (const [key, value] of Object.entries(attributes)) if (key.startsWith('data-')) this.dataset[key.slice(5)] = value;
      this.hidden = Object.hasOwn(attributes, 'hidden');
      this.disabled = Object.hasOwn(attributes, 'disabled');
      this.value = ''; this.textContent = ''; this.markup = '';
    }
    set innerHTML(value) {
      this.markup = value;
      if (this.id !== 'app') return;
      for (const id of [...elements.keys()]) if (!['app', 'skip', 'announcements'].includes(id)) elements.delete(id);
      for (const match of value.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)>/g)) {
        const attrs = {};
        for (const attr of match[2].matchAll(/([a-z][a-z0-9-]*)(?:="([^"]*)")?/g)) attrs[attr[1]] = decode(attr[2] || '');
        if (attrs.id) elements.set(attrs.id, new Element(attrs.id, attrs));
      }
      const text = value.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/);
      if (text) elements.get('answer').value = decode(text[1]);
    }
    get innerHTML() { return this.markup; }
    setAttribute(name, value) { this.attributes[name] = value; }
    getAttribute(name) { return this.attributes[name] ?? null; }
    removeAttribute(name) { delete this.attributes[name]; }
    focus() { focus = this.id; }
    closest(selector) { return selector === 'button' ? this : null; }
    addEventListener(type, callback) { callbacks.set(type, callback); }
    append() {}
    click() { downloads.push({ href: this.href, download: this.download }); }
    remove() {}
  }
  for (const id of ['app', 'skip', 'announcements']) elements.set(id, new Element(id));
  const document = { getElementById: id => elements.get(id), documentElement: {}, title: '', body: new Element(), createElement: () => new Element() };
  const storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key)
  };
  let blob;
  const context = createContext({
    document, Blob,
    URL: {
      createObjectURL(value) { if (downloadFailure) throw new Error('Download unavailable'); blob = value; return 'blob:local'; },
      revokeObjectURL() {}
    },
    window: { setTimeout(callback) { callback(); } },
    get localStorage() { if (unavailable) throw new Error('Storage unavailable'); return storage; }
  });
  new Script(source).runInContext(context);
  const get = id => elements.get(id);
  function click(id) { const target = get(id); assert.ok(target, id); callbacks.get('click')({ target }); }
  function select(id, value) { const target = get(id); target.value = value; callbacks.get('change')({ target }); }
  function fill(value) { get('answer').value = value; callbacks.get('input')({ target: get('answer') }); }
  function submit() { callbacks.get('submit')({ target: { id: 'answer-form' }, preventDefault() {} }); }
  return { get, document, data, downloads, click, select, fill, submit, focus: () => focus, blob: () => blob, markup: () => get('app').innerHTML };
}

test('application starts in English with French practice and three steps', () => {
  const app = launch();
  assert.equal(app.document.documentElement.lang, 'en');
  assert.equal(app.get('answer').attributes.lang, 'fr');
  assert.equal(app.get('example').hidden, true);
  assert.equal(app.get('previous').disabled, true);
  assert.equal(app.get('next').disabled, false);
  assert.equal(app.get('feedback').getAttribute('aria-live'), 'polite');
  assert.ok(app.markup().includes('Step 1 of 3'));
});
test('empty submission validates and focuses the response', () => {
  const app = launch(); app.submit();
  assert.equal(app.get('answer').getAttribute('aria-invalid'), 'true');
  assert.equal(app.focus(), 'answer');
  assert.equal(app.get('example').hidden, true);
  assert.ok(app.get('answer-error').textContent.includes('Write a response'));
});
test('submission shows feedback, accent note, limits and example', () => {
  const app = launch();
  app.fill('Merci de votre presence. Je souhaite faire le point avec vous.'); app.submit();
  assert.ok(app.get('feedback').innerHTML.includes('Found with different accents'));
  assert.ok(app.get('feedback').innerHTML.includes('does not check grammar or meaning'));
  assert.equal(app.get('example').hidden, false);
  assert.equal(app.get('show-example').getAttribute('aria-expanded'), 'true');
  assert.equal(app.data.size, 0);
});
test('example can be requested before writing', () => {
  const app = launch(); app.click('show-example');
  assert.equal(app.get('example').hidden, false);
  assert.equal(app.focus(), 'example-title');
});
test('interface choice changes labels and lang without losing draft or direction', () => {
  const app = launch(); app.fill('Bonjour, voici mon texte.'); app.select('interface-language', 'fr');
  assert.equal(app.document.documentElement.lang, 'fr');
  assert.equal(app.get('answer').attributes.lang, 'fr');
  assert.equal(app.get('answer').value, 'Bonjour, voici mon texte.');
  assert.equal(app.focus(), 'interface-language');
  assert.ok(app.markup().includes('Vérifier ma réponse'));
});
test('steps and scenarios preserve separate drafts and update focus', () => {
  const app = launch(); app.fill('Un premier texte.'); app.click('next');
  assert.equal(app.focus(), 'step-title');
  assert.equal(app.get('answer').value, '');
  app.fill('Un deuxième texte.'); app.click('previous');
  assert.equal(app.get('answer').value, 'Un premier texte.');
  app.click('scenario-email');
  assert.equal(app.get('answer').value, '');
  assert.equal(app.focus(), 'practice');
  app.click('scenario-meeting');
  assert.equal(app.get('answer').value, 'Un premier texte.');
});
test('self-assessments update per-scenario progress and use one storage key', () => {
  const app = launch(); app.click('rating-almost');
  assert.equal(app.get('rating-almost').getAttribute('aria-pressed'), 'true');
  assert.equal(app.get('rating-comfortable').getAttribute('aria-pressed'), 'false');
  assert.ok(app.markup().includes('1 of 3 steps assessed'));
  assert.equal(app.focus(), 'rating-almost');
  app.select('practice-language', 'en');
  assert.equal(app.get('rating-almost').getAttribute('aria-pressed'), 'false');
  app.click('rating-comfortable'); app.select('practice-language', 'fr');
  assert.equal(app.get('rating-almost').getAttribute('aria-pressed'), 'true');
  assert.equal(app.data.size, 1);
  const saved = JSON.parse([...app.data.values()][0]);
  assert.deepEqual(saved.progress, { 'meeting:fr:1': 'almost', 'meeting:en:1': 'comfortable' });
});
test('export downloads only self-assessments; clear resets progress and drafts', async () => {
  const app = launch(); app.fill('Private response.'); app.click('rating-practice'); app.click('export');
  assert.deepEqual(app.downloads, [{ href: 'blob:local', download: 'workplace-progress.json' }]);
  assert.deepEqual(JSON.parse(await app.blob().text()), { version: 1, progress: { 'meeting:fr:1': 'practice' } });
  app.click('clear');
  assert.equal(app.data.size, 0);
  assert.equal(app.get('answer').value, '');
  assert.equal(app.get('rating-practice').getAttribute('aria-pressed'), 'false');
  assert.equal(app.get('announcements').textContent, 'Progress cleared.');
});
test('denied local storage still allows feedback, assessment, export and clear', async () => {
  const app = launch({ unavailable: true });
  assert.equal(app.get('storage-warning').hidden, false);
  app.fill('Merci de votre présence. Je souhaite faire le point.'); app.submit(); app.click('rating-comfortable');
  assert.equal(app.get('example').hidden, false);
  assert.equal(app.get('rating-comfortable').getAttribute('aria-pressed'), 'true');
  app.click('export');
  assert.equal(JSON.parse(await app.blob().text()).progress['meeting:fr:1'], 'comfortable');
  app.click('clear');
  assert.equal(app.get('rating-comfortable').getAttribute('aria-pressed'), 'false');
  assert.ok(app.get('announcements').textContent.includes('Saving is unavailable'));
});
test('failed export gives a translated status', () => {
  const app = launch({ downloadFailure: true }); app.select('interface-language', 'fr'); app.click('export');
  assert.ok(app.get('announcements').textContent.includes('n’a pas pu être créée'));
});
test('response text is escaped when the interface is rendered again', () => {
  const app = launch(); app.fill('<img src=x onerror=alert(1)> & "text"'); app.select('interface-language', 'fr');
  assert.ok(app.markup().includes('&lt;img src=x onerror=alert(1)&gt; &amp; &quot;text&quot;'));
  assert.ok(!app.markup().includes('<img'));
  assert.equal(app.get('answer').value, '<img src=x onerror=alert(1)> & "text"');
});
