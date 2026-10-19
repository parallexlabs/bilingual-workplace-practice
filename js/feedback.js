export const INFORMAL = {
  fr: ['tu', 'toi', 'ton', 'ta', 'tes'],
  en: ['hey', 'yo', 'gonna', 'wanna', 'dude', 'lol']
};

export function normalize(text) {
  return String(text).normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase().replace(/[’‘]/g, "'");
}

function contains(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u').test(text);
}

export function checkAnswer(answer, { language, expressions, emailPart = null }) {
  const text = String(answer);
  const folded = normalize(text);
  const original = text.normalize('NFC').toLocaleLowerCase().replace(/[’‘]/g, "'");
  const words = text.trim().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
  const result = {
    expressions: expressions.map(expression => ({
      expression,
      found: contains(folded, normalize(expression)),
      accentOnly: contains(folded, normalize(expression)) && !contains(original, expression.normalize('NFC').toLocaleLowerCase().replace(/[’‘]/g, "'"))
    })),
    informal: INFORMAL[language].filter(word => contains(folded, word)),
    words: words.length,
    length: words.length < 8 ? 'short' : words.length > 100 ? 'long' : 'ok',
    email: null
  };
  if (emailPart) {
    const greetings = language === 'fr' ? ['bonjour', 'bonsoir'] : ['hello', 'dear', 'good morning', 'good afternoon'];
    const closings = language === 'fr' ? ['cordialement', 'bien à vous', 'bonne journée', 'merci'] : ['kind regards', 'best regards', 'regards', 'thank you', 'thanks'];
    const lines = text.split(/\n/).map(line => line.trim()).filter(Boolean);
    const first = normalize(lines[0] || '');
    const last = normalize(lines.slice(-2).join(' '));
    result.email = {
      part: emailPart,
      greeting: emailPart === 'greeting' ? greetings.some(word => first.startsWith(normalize(word)) && contains(first, normalize(word))) : null,
      closing: emailPart === 'closing' ? closings.some(word => contains(last, normalize(word))) : null
    };
  }
  return result;
}
