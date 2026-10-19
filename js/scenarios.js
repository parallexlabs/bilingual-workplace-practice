import { scenarioData } from './content.js';

export const scenarios = scenarioData;
export function progressKey(scenarioId, language, stepId) {
  return `${scenarioId}:${language}:${stepId}`;
}
