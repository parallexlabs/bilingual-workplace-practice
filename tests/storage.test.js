import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, createStorage, emptyProgress, cleanProgress, exportProgress } from '../js/storage.js';

function stub() {
  const data = new Map([['unrelated', 'keep']]);
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
}
const sample = { version: 1, progress: { 'meeting:fr:1': 'comfortable', 'email:en:3': 'almost' } };
test('empty storage loads empty progress', () => {
  const storage = createStorage(() => stub());
  assert.deepEqual(storage.load(), emptyProgress());
  assert.equal(storage.available, true);
});
test('save and load use exactly one key and clear preserves unrelated data', () => {
  const local = stub();
  const storage = createStorage(() => local);
  assert.equal(storage.save(sample), true);
  assert.equal(local.data.size, 2);
  assert.deepEqual(JSON.parse(local.data.get(STORAGE_KEY)), sample);
  assert.deepEqual(storage.load(), sample);
  assert.equal(storage.clear(), true);
  assert.deepEqual([...local.data], [['unrelated', 'keep']]);
  assert.deepEqual(storage.load(), emptyProgress());
});
for (const method of ['getItem', 'setItem', 'removeItem']) {
  test(`storage handles throwing ${method}`, () => {
    const local = stub();
    local[method] = () => { throw new Error('unavailable'); };
    const storage = createStorage(() => local);
    if (method === 'getItem') assert.deepEqual(storage.load(), emptyProgress());
    if (method === 'setItem') assert.equal(storage.save(sample), false);
    if (method === 'removeItem') assert.equal(storage.clear(), false);
    assert.equal(storage.available, false);
    assert.deepEqual(JSON.parse(exportProgress(sample)), sample);
  });
}
test('a throwing localStorage property getter is handled', () => {
  const storage = createStorage(() => { throw new Error('denied'); });
  assert.deepEqual(storage.load(), emptyProgress());
  assert.equal(storage.save(sample), false);
  assert.equal(storage.clear(), false);
  assert.equal(storage.available, false);
});
test('storage can recover after a temporary failure', () => {
  let failed = true;
  const local = stub();
  const storage = createStorage(() => { if (failed) throw new Error('denied'); return local; });
  storage.load(); failed = false;
  assert.equal(storage.save(sample), true);
  assert.equal(storage.available, true);
});
test('invalid stored JSON is handled', () => {
  const local = stub(); local.data.set(STORAGE_KEY, '{broken');
  const storage = createStorage(() => local);
  assert.deepEqual(storage.load(), emptyProgress());
  assert.equal(storage.available, false);
});
test('progress rejects invalid versions, keys and ratings', () => {
  for (const value of [null, [], {}, { version: 2, progress: {} }, { version: 1, progress: null }]) assert.deepEqual(cleanProgress(value), emptyProgress());
  const value = { version: 1, drafts: 'private response', progress: { ...sample.progress, 'meeting:fr:4': 'almost', 'meeting:de:1': 'almost', 'meeting:en:1': 'invalid', constructor: 'practice' } };
  assert.deepEqual(cleanProgress(value), sample);
  assert.equal(exportProgress(value).includes('private response'), false);
});
test('export includes only valid progress and version', () => {
  assert.deepEqual(JSON.parse(exportProgress({ ...sample, answer: 'private' })), sample);
});
