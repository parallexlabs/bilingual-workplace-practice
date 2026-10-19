export const STORAGE_KEY = 'workplace-practice.progress.v1';

export function emptyProgress() { return { version: 1, progress: {} }; }

export function cleanProgress(value) {
  const clean = emptyProgress();
  if (value?.version !== 1 || !value.progress || typeof value.progress !== 'object') return clean;
  for (const [key, rating] of Object.entries(value.progress)) {
    if (/^(meeting|email):(en|fr):[1-3]$/.test(key) && ['practice', 'almost', 'comfortable'].includes(rating)) clean.progress[key] = rating;
  }
  return clean;
}

export function createStorage(getStorage = () => globalThis.localStorage) {
  let available = true;
  return {
    get available() { return available; },
    load() {
      try {
        const raw = getStorage().getItem(STORAGE_KEY);
        return raw ? cleanProgress(JSON.parse(raw)) : emptyProgress();
      } catch { available = false; return emptyProgress(); }
    },
    save(value) {
      try { getStorage().setItem(STORAGE_KEY, JSON.stringify(cleanProgress(value))); available = true; return true; }
      catch { available = false; return false; }
    },
    clear() {
      try { getStorage().removeItem(STORAGE_KEY); available = true; return true; }
      catch { available = false; return false; }
    }
  };
}

export function exportProgress(value) { return JSON.stringify(cleanProgress(value), null, 2); }
