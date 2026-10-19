import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = new URL('../', import.meta.url);
const read = async path => readFile(new URL(path, base), 'utf8');

export async function snapshots() {
  const dictionaries = { en: JSON.parse(await read('i18n/en.json')), fr: JSON.parse(await read('i18n/fr.json')) };
  const scenarioData = await Promise.all(['meeting', 'email'].map(async name => JSON.parse(await read(`data/scenarios/${name}.json`))));
  const content = `// Embedded local content. See scripts/sync-offline.js.\nexport const dictionaries = ${JSON.stringify(dictionaries, null, 2)};\nexport const scenarioData = ${JSON.stringify(scenarioData, null, 2)};\n`;
  const parts = [content, ...await Promise.all(['i18n', 'feedback', 'storage', 'scenarios', 'app'].map(name => read(`js/${name}.js`)))];
  const source = parts.map(part => part.replace(/^import .*;\n/gm, '').replace(/^export /gm, '')).join('\n');
  return {
    'js/content.js': content,
    'js/offline.js': `// File-compatible entry script. See scripts/sync-offline.js.\n(() => {\n'use strict';\n${source}\n})();\n`
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const [path, content] of Object.entries(await snapshots())) await writeFile(new URL(path, base), content);
}
