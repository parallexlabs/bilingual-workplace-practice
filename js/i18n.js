import { dictionaries } from './content.js';

export function translate(language, key, values = {}) {
  const template = dictionaries[language]?.[key];
  if (typeof template !== 'string') throw new Error(`Missing translation: ${language}.${key}`);
  return template.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(values, name) ? String(values[name]) : match);
}
