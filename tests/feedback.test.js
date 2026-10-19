import test from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswer, normalize, INFORMAL } from '../js/feedback.js';

const check = (answer, options = {}) => checkAnswer(answer, { language: 'fr', expressions: [], ...options });

test('target phrases match ignoring case', () => {
  const result = check('MERCI DE VOTRE PRÉSENCE. Je souhaite faire le point.', { expressions: ['merci de votre présence', 'faire le point', 'bonjour'] });
  assert.deepEqual(result.expressions.map(item => item.found), [true, true, false]);
  assert.ok(result.expressions.every(item => !item.accentOnly));
});
test('accent-only matches are explicitly distinguished', () => {
  const result = check('Merci de votre presence.', { expressions: ['merci de votre présence'] });
  assert.equal(result.expressions[0].found, true);
  assert.equal(result.expressions[0].accentOnly, true);
});
test('composed and decomposed accents are equivalent', () => {
  const result = check('présence'.normalize('NFD'), { expressions: ['présence'] });
  assert.equal(result.expressions[0].found, true);
  assert.equal(result.expressions[0].accentOnly, false);
});
test('normalization handles accents, case and apostrophes', () => {
  assert.equal(normalize('ÉTÉ d’Août'), "ete d'aout");
  assert.equal(check('D’accord', { expressions: ["d'accord"] }).expressions[0].found, true);
});
test('phrase matching accepts whitespace and rejects substrings', () => {
  assert.equal(check('faire   le\npoint', { expressions: ['faire le point'] }).expressions[0].found, true);
  assert.equal(check('rebonjour', { expressions: ['bonjour'] }).expressions[0].found, false);
  assert.equal(check('yesno', { language: 'en', expressions: ['no'] }).expressions[0].found, false);
  assert.equal(check('ébonjour', { expressions: ['bonjour'] }).expressions[0].found, false);
});
test('regular expression punctuation in target phrases is literal', () => {
  assert.equal(check('10 axmx', { language: 'en', expressions: ['10 a.m.'] }).expressions[0].found, false);
  assert.equal(check('(10 a.m.)', { language: 'en', expressions: ['10 a.m.'] }).expressions[0].found, true);
  assert.equal(check('C++ [ok]', { language: 'en', expressions: ['C++', '[ok]'] }).expressions.filter(item => item.found).length, 2);
});
for (const language of ['fr', 'en']) {
  for (const word of INFORMAL[language]) {
    test(`${language} register flags whole word ${word}`, () => {
      assert.deepEqual(check(`${word.toUpperCase()}!`, { language }).informal, [word]);
    });
  }
}
test('French register does not flag longer words or formal vous', () => {
  assert.deepEqual(check('Votre tableau contient une question. Nous vous remercions pour votre présence.').informal, []);
});
test('English register does not flag longer words', () => {
  assert.deepEqual(check('The young person enjoyed the heyday of this style.', { language: 'en' }).informal, []);
});
test('register checks apply only to the selected practice language', () => {
  assert.deepEqual(check('hey dude', { language: 'fr' }).informal, []);
  assert.deepEqual(check('tu toi ton', { language: 'en' }).informal, []);
});
const greetings = { fr: ['Bonjour', 'Bonsoir'], en: ['Hello', 'Dear', 'Good morning', 'Good afternoon'] };
const closings = { fr: ['Cordialement', 'Bien à vous', 'Bonne journée', 'Merci'], en: ['Kind regards', 'Best regards', 'Regards', 'Thank you', 'Thanks'] };
for (const language of ['fr', 'en']) {
  test(`${language} greeting accepts every documented greeting`, () => {
    for (const greeting of greetings[language]) assert.equal(check(`\n  ${greeting.toUpperCase()} Alex,\nA response.`, { language, emailPart: 'greeting' }).email.greeting, true, greeting);
  });
  test(`${language} closing accepts every documented closing`, () => {
    for (const closing of closings[language]) assert.equal(check(`A response.\n${closing.toUpperCase()},\nMorgan\n`, { language, emailPart: 'closing' }).email.closing, true, closing);
  });
}
test('greeting must start first non-empty line and be a whole word', () => {
  for (const answer of ['Je dis bonjour.', 'Le sujet\nBonjour Alex', 'Bonjourrr', '']) assert.equal(check(answer, { emailPart: 'greeting' }).email.greeting, false);
});
test('closing must be within last two non-empty lines', () => {
  assert.equal(check('Cordialement\nMorgan\nAutre ligne', { emailPart: 'closing' }).email.closing, false);
  assert.equal(check('incordialement', { emailPart: 'closing' }).email.closing, false);
  assert.equal(check('', { emailPart: 'closing' }).email.closing, false);
});
test('e-mail checks use the practice language', () => {
  assert.equal(check('Hello Alex', { emailPart: 'greeting' }).email.greeting, false);
  assert.equal(check('Cordialement', { language: 'en', emailPart: 'closing' }).email.closing, false);
});
test('only the relevant e-mail component is checked', () => {
  assert.equal(check('Bonjour', { emailPart: 'greeting' }).email.closing, null);
  assert.equal(check('Cordialement', { emailPart: 'closing' }).email.greeting, null);
  assert.equal(check('A meeting response').email, null);
});
for (const [count, expected] of [[0, 'short'], [7, 'short'], [8, 'ok'], [100, 'ok'], [101, 'long']]) {
  test(`length boundary ${count} words is ${expected}`, () => {
    const result = check(Array(count).fill('mot').join(' '));
    assert.equal(result.words, count);
    assert.equal(result.length, expected);
  });
}
test('word count handles punctuation, line breaks and contractions', () => {
  assert.equal(check('Bonjour!\nC’est l’heure, à 10 h.').words, 6);
  assert.equal(check('... \n').words, 0);
});
