import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { Script } from 'node:vm';

const base = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, base), 'utf8');
async function walk(path = '') {
  const entries = await readdir(new URL(path || './', base), { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const name = path + entry.name;
    if (entry.isDirectory()) paths.push(...await walk(`${name}/`));
    else if (!['PROJECT_BRIEF.md', 'ACCEPTANCE.md'].includes(name)) paths.push(name);
  }
  return paths;
}
test('runtime has no network APIs, remote resources or indirect code loading', async () => {
  const paths = (await walk()).filter(path => path.startsWith('js/') || path.startsWith('css/') || path === 'index.html');
  const forbidden = [
    /\bfetch\s*\(/i, /XMLHttpRequest/i, /WebSocket/i, /EventSource/i,
    /sendBeacon/i, /import\s*\(/, /importScripts\s*\(/, /new\s+(?:SharedWorker|Worker)\s*\(/,
    /serviceWorker/i, /https?:\/\//i, /(?:src|href)\s*=\s*["']\s*\/\//i,
    /@import/i, /\beval\s*\(/, /new\s+Function\s*\(/, /\.cookie\b/
  ];
  for (const path of paths) {
    const source = await read(path);
    for (const pattern of forbidden) assert.equal(pattern.test(source), false, `${path}: ${pattern}`);
  }
  const html = await read('index.html');
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) assert.ok(match[1].startsWith('#') || /^(css|js)\/[a-z.-]+$/.test(match[1]), match[1]);
});
test('file entry is a valid classic script with no runtime imports', async () => {
  const html = await read('index.html');
  assert.match(html, /<script src="js\/offline.js" defer><\/script>/);
  const source = await read('js/offline.js');
  assert.doesNotThrow(() => new Script(source));
  assert.doesNotMatch(source, /^\s*(?:import|export)\s/m);
});
test('repository additions use permitted punctuation and naming', async () => {
  const forbiddenDash = new RegExp(`[${String.fromCodePoint(0x2013, 0x2014)}]`);
  // Tool and model names must not appear in tracked files; the plain word for the technology may, in the disclosure line.
  const forbiddenName = new RegExp('\\b(' + ['Clau' + 'de', 'Anthro' + 'pic', 'Open' + 'AI', 'Chat' + 'GPT', 'Co' + 'dex', 'Co' + 'pilot', 'Gem' + 'ini', 'G' + 'PT-\\d'].join('|') + ')\\b', 'i');
  for (const path of await walk()) {
    const source = await read(path);
    assert.equal(forbiddenDash.test(source), false, path);
    assert.equal(forbiddenName.test(source), false, path);
  }
});
test('there are no package dependencies and tests use the built-in runner', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.equal(pkg.scripts.test, 'node --test');
  for (const key of ['dependencies', 'devDependencies', 'optionalDependencies']) assert.equal(Object.keys(pkg[key] || {}).length, 0);
  for (const path of (await walk()).filter(path => path.startsWith('tests/') && path.endsWith('.js'))) {
    const source = await read(path);
    for (const match of source.matchAll(/from ['"]([^'"]+)/g)) assert.ok(match[1].startsWith('node:') || match[1].startsWith('../'), match[1]);
  }
});
test('static accessibility hooks and adaptive layout are present', async () => {
  const html = await read('index.html');
  const app = await read('js/app.js');
  const css = await read('css/style.css');
  assert.match(html, /name="viewport"/);
  assert.match(html, /id="skip"/);
  assert.match(html, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(app, /id="feedback"[^>]+aria-live="polite" aria-atomic="true"/);
  assert.match(app, /<label for="answer">/);
  assert.match(app, /document\.documentElement\.lang = state\.ui/);
  assert.match(app, /aria-pressed/);
  assert.match(app, /aria-current="step"/);
  assert.match(app, /<fieldset/);
  assert.match(app, /spellcheck="false"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /@media \(max-width: 440px\)/);
  assert.match(css, /min-height: 44px/);
});
function luminance(hex) {
  const channels = hex.match(/[a-f0-9]{2}/gi).map(channel => parseInt(channel, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
test('text palette meets 4.5 to 1 contrast on its surfaces', async () => {
  const css = await read('css/style.css');
  const token = name => css.match(new RegExp(`--${name}: (#[a-f0-9]+);`))[1];
  const pairs = [
    [token('ink'), '#ffffff'], [token('ink'), token('paper')], [token('muted'), '#ffffff'],
    [token('muted'), token('paper')], [token('muted'), token('tint')], [token('teal'), '#ffffff'],
    [token('teal-dark'), token('tint')], ['#943514', '#ffffff'], ['#943514', token('paper')],
    [token('ink'), '#f2f5f4']
  ];
  for (const [text, background] of pairs) {
    const levels = [luminance(text), luminance(background)].sort((a, b) => b - a);
    assert.ok((levels[0] + .05) / (levels[1] + .05) >= 4.5, `${text} on ${background}`);
  }
});
test('licence, attribution and translation notices are present', async () => {
  const notice = 'French not yet reviewed by a professional translator.';
  for (const path of ['README.md', 'README.fr.md']) assert.ok((await read(path)).includes(notice));
  assert.match(await read('LICENSE'), /Apache License\s+Version 2\.0/);
  assert.match(await read('CONTENT_LICENSE.md'), /CC BY 4\.0/);
  assert.match(await read('CITATION.cff'), /family-names: Daneshpajouh/);
  assert.match(await read('CITATION.cff'), /given-names: Amir/);
});
