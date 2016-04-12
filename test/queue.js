import 'babel-polyfill';
import test from 'ava';
import Queue from '../lib/queue.js';

test('store created empty', t => {
  const cb = () => 'callback!';
  const q = new Queue(cb, 2);
  t.ok(q._size, 0, 'Store created empty.');
});

test('add string to store', t => {
  const cb = () => 'callback!';
  const q = new Queue(cb, 2);

  q.add('unicorn');
  t.is(q._toString(), 'unicorn', 'Adding string works fine.');
});

test('add array to store ', t => {
  const cb = () => 'callback!';
  const q = new Queue(cb, 2);

  q.add(['bicorn', 'asparagus']);
  t.is(q._toString(), 'bicorn,asparagus', 'Adding array works fine.');
});

test('add objects, booleans and numbers to store fails', t => {
  const cb = () => 'callback!';
  const q = new Queue(cb, 2);

  q.add({ bicorn: 'asparagus' });
  q.add(new Boolean());
  q.add(15);
  t.is(q._toString(), '', 'Adding non-array fails.');
});

test('only unique items in store', t => {
  const cb = () => 'callback!';
  const q = new Queue(cb, 2);

  q.add('asparagus');
  q.add('asparagus');
  t.is(q._toString(), 'asparagus', 'Adding array works fine.');
});

test('remove() works as expected', t => {
  const cb = () => 'callback!';
  const q = new Queue(cb, 2);

  q.add('asparagus');
  q.remove('asparagus');
  t.is(q._toString(), '', 'remove() works fine.');
});

test('callback calls back!', t => {
  let n = 0;
  const cb = () => {
    n = 1;
  };

  const q = new Queue(cb, 2);
  q.add(['asparagus', 'whatever']);

  t.is(n, 1, 'Callback calls back.');
});

test('take(n) actually takes n', t => {
  const cb = () => 'callback!';

  const q = new Queue(cb, 2);
  q.add(['asparagus', 'whatever', 'woop-woop']);

  t.is(q.take(2).toString(), 'asparagus,whatever', 'take(n) takes');
});
