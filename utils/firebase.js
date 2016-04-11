import config from '../config';
import log from './logger';

export function generateURL(name) {
  return `https://${config.firebase}.firebaseio.com/${name}.json?auth=${config.secret}`; // eslint-disable-line
}

export function keyFromObj(obj) {
  if (Object.keys(obj).length > 1) throw new Error('More than one key in obj');

  return Object.keys(obj)[0];
}

/*
 * @param data { path: '/uid/$param', data: {}}
 * @returns Object { uid: $uid, params { ... }}
 */
export function url2data(data) {
  try {
    let path = removeForwardSlash(data.path);
    path = path.split('/');

    switch (path.length) {
      case 0:
        throw new Error('Malformed data');

      case 1:
        log.debug('In case1');
        return {
          uid: path[0],
          params: data.data,
        };

      case 2:
        log.debug('In case2');
        return {
          uid: path[0],
          params: {
            [path[1]]: data.data,
          },
        };

      default:
        throw new Error('Suspicious data', data);
    }
  } catch (err) {
    log.error(err);
  }
}

function removeForwardSlash(str) {
  return str.replace('/', '');
}
