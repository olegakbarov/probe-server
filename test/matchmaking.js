import test from 'ava';

test('data shape on getting history', t => {
  t.pass();
});

test('bar', async t => {
  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
});
