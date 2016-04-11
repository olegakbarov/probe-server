import EventSource from 'eventsource';
import axios from 'axios';
import log from './utils/logger';
import Queue from './lib/queue.js';
import {
  generateURL,
  url2data,
} from './utils/firebase';

const source = new EventSource(generateURL('online'));

// creating queue instance with callback and batch size params:
const userQueue = new Queue(tryCreateGame, 2);

source.addEventListener('put', e => {
  const data = JSON.parse(e.data);

  if (data.path === '/') {
    if (data.data !== null) {
      handleHistory(data.data);
    }
  } else {
    handleUpdate(data);
  }
});

source.addEventListener('open', e => {
  log.info('Connection opened!', e);
});

source.addEventListener('auth_revoked', e => {
  log.error('Authentication token was revoked.', e);
});

source.addEventListener('error', e => {
  if (e.readyState === EventSource.CLOSED) {
    log.error('Connection was closed! ', e);
  } else {
    log.error('An unknown error occurred: ', e);
  }
}, false);

/* ================================================================ */

export function handleUpdate(data) {
  try {
    /*
     * Main idea of url2data is to returned data of expected shape
     */
    const { uid, params } = url2data(data);

    if (params.searchingGame) {
      log.info(`adding ${uid} to user queue`);
      userQueue.add(uid);
      log.info(`current user Queue = ${userQueue._toString()}`);
    } else {
      userQueue.remove(uid);
    }
  } catch (err) {
    log.error(err);
  }
}

export function handleHistory(e) {
  // incoming data here:
  // (facebook:1271223042891252=true, twitter:375782623=false)
  log.info('HANDLE HISTORY', e);
  if (!e) {
    log.error('handleHistory input:', e);
    return;
  }

  // take only users who currently searching game (aka =true)
  const arr = Object.keys(e)
    .map(i => ({ [i]: e[i] }))
    .filter(i => i);

  arr.forEach(i => {
    const key = Object.keys(i);
    userQueue.add(key);
  });
}

export function tryCreateGame() {
  const batch = userQueue.take(2);

  if (batch[0] === undefined || batch[1] === undefined) {
    throw new Error('Undefined got from userQueue');
  }

  createGame(...batch);
}

// TODO! Rewrite as transaction
export async function createGame(u1, u2) {
  if (u1 === undefined || u1 === undefined) {
    log.info('Got active users in queue:', u1, u2);
    throw new Error('Undefined passed as use');
  }

  try {
    await markUserNotSearching(u1);
    await markUserNotSearching(u2);
    await axios.put(generateURL(`games/${u1}-vs-${u2}`), {
      user1: u1,
      user2: u2,
    });
  } catch (err) {
    log.error(err);
  }
}

export async function markUserNotSearching(u) {
  if (typeof u === 'undefined' || u === undefined || u === 'undefined') {
    log.error('Undefined passed as user');
    return;
  }

  try {
    // REMEMBER! post to this endpoint triggers event from eventSource!
    await axios.put(generateURL(`online/${u}/`), {
      searchingGame: false,
      foundGame: true,
    });
    log.info(`${u} successfully marked as founded game`);
  } catch (err) {
    log.error(err);
  }
}
