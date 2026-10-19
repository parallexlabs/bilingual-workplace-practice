import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dictionaries, scenarioData } from '../js/content.js';
import { translate } from '../js/i18n.js';
import { scenarios, progressKey } from '../js/scenarios.js';
import { checkAnswer } from '../js/feedback.js';
import { snapshots } from '../scripts/sync-offline.js';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const json = async path => JSON.parse(await read(path));
test('dictionaries have identical keys and non-empty string values', async () => {
  const en = await json('i18n/en.json');
  const fr = await json('i18n/fr.json');
  assert.deepEqual(Object.keys(en).sort(), Object.keys(fr).sort());
  for (const [language, dictionary] of Object.entries({ en, fr })) {
    for (const [key, value] of Object.entries(dictionary)) {
      assert.equal(typeof value, 'string', `${language}.${key}`);
      assert.ok(value.trim().length, `${language}.${key}`);
      const placeholders = text => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
      assert.deepEqual(placeholders(value), placeholders(en[key]), key);
    }
    assert.deepEqual(dictionaries[language], dictionary);
  }
});
test('translation interpolates and rejects unknown keys', () => {
  assert.equal(translate('fr', 'step', { current: 2, total: 3 }), 'Étape 2 sur 3');
  assert.throws(() => translate('en', 'absent'), /Missing translation/);
});
test('all literal interface translation keys exist', async () => {
  const app = await read('js/app.js');
  for (const match of app.matchAll(/(?:\bt|translatedParagraph|announce)\('([^']+)'/g)) assert.ok(Object.hasOwn(dictionaries.en, match[1]), match[1]);
  for (const key of ['practice', 'almost', 'comfortable', 'unrated', 'feedback', 'found', 'missing', 'accent', 'lengthShort', 'lengthLong', 'lengthOk', 'greetingYes', 'greetingNo', 'closingYes', 'closingNo', 'howRules', 'howRegister', 'howEmail', 'howLength', 'howExample', 'howSynthetic', 'howPrivacy', 'translation']) assert.ok(Object.hasOwn(dictionaries.fr, key), key);
});
test('static fallback messages have matching bilingual dictionary entries', async () => {
  const html = await read('index.html');
  for (const language of ['en', 'fr']) assert.ok(html.includes(dictionaries[language].enableScript));
  assert.ok(html.includes(dictionaries.en.pageTitle));
});
test('exactly two synthetic scenario cards have three bilingual steps', async () => {
  assert.deepEqual(scenarioData.map(item => item.id), ['meeting', 'email']);
  assert.deepEqual(scenarios, scenarioData);
  for (const scenario of scenarios) {
    assert.deepEqual(scenario, await json(`data/scenarios/${scenario.id}.json`));
    for (const language of ['en', 'fr']) assert.ok(scenario.title[language].trim());
    assert.deepEqual(scenario.steps.map(step => step.id), [1, 2, 3]);
    for (const step of scenario.steps) {
      for (const field of ['title', 'situation', 'task', 'register', 'answer', 'note', 'expressions']) {
        assert.deepEqual(Object.keys(step[field]).sort(), ['en', 'fr'], `${scenario.id}.${step.id}.${field}`);
        for (const language of ['en', 'fr']) {
          const value = step[field][language];
          if (field === 'expressions') {
            assert.ok(value.length >= 2 && value.length <= 5);
            assert.equal(new Set(value).size, value.length);
            assert.ok(value.every(item => typeof item === 'string' && item.trim()));
          } else assert.ok(typeof value === 'string' && value.trim(), `${field}.${language}`);
        }
      }
      assert.match(step.register.fr, /vouvoiement/);
      assert.match(step.register.en, /neutral, professional/);
    }
  }
});
for (const scenario of scenarios) {
  for (const step of scenario.steps) {
    for (const language of ['en', 'fr']) {
      test(`${scenario.id} step ${step.id} ${language} example satisfies its own rules`, () => {
        const result = checkAnswer(step.answer[language], { language, expressions: step.expressions[language], emailPart: step.emailPart });
        assert.ok(result.expressions.every(item => item.found && !item.accentOnly));
        assert.deepEqual(result.informal, []);
        assert.equal(result.length, 'ok');
        if (step.emailPart === 'greeting') assert.equal(result.email.greeting, true);
        if (step.emailPart === 'closing') assert.equal(result.email.closing, true);
      });
    }
  }
}
test('e-mail checks are applied only to the greeting and closing steps', () => {
  const [greeting, middle, closing] = scenarios[1].steps;
  assert.equal(greeting.emailPart, 'greeting');
  assert.equal(middle.emailPart, undefined);
  assert.equal(closing.emailPart, 'closing');
  assert.ok(scenarios[0].steps.every(step => !step.emailPart));
});
test('progress identifiers are separate for each scenario, direction and step', () => {
  const keys = scenarios.flatMap(scenario => ['en', 'fr'].flatMap(language => scenario.steps.map(step => progressKey(scenario.id, language, step.id))));
  assert.equal(keys.length, 12);
  assert.equal(new Set(keys).size, 12);
});
test('checked-in entry script and embedded content match the ES modules and JSON', async () => {
  for (const [path, expected] of Object.entries(await snapshots())) assert.equal(await read(path), expected, `Refresh ${path} with node scripts/sync-offline.js`);
});
