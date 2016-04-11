export default class Queue {
  /**
   * @param  {Function} cb - a function to call when e occurs
   * @param {Number} batchSize - minimum size of batch to call a function
   * @return {Queue}
   */
  constructor(cb, batchSize) {
    const store = [];

    this._size = () => store.length;

    this._toString = () => store.toString();

    /**
     * Add elements to queue
     * @param  {Any|Array} el — accepts strings and array of strings
     * @return {void}
     */
    this.add = el => {
      if (Array.isArray(el)) {
        el.forEach(item => {
          if (!this.isInQueue(item)) {
            store.push(item);
          }
        });
      } else if (typeof el === 'string') {
        if (!this.isInQueue(el)) {
          store.push(el);
        }
      } else {
        return;
      }

      this.handleMutation();
    };

    this.remove = el => {
      if (typeof el !== 'string') {
        throw new TypeError('Invalid type. Expected string');
      }

      if (store.indexOf(el) >= 0) {
        store.splice(store.indexOf(el), 1);
      }
    };

    this.isInQueue = i => store.indexOf(i) >= 0;

    this.take = n => {
      const res = store.splice(0, n);
      this.handleMutation();

      return res;
    };

    this.handleMutation = () => {
      if (store.length >= batchSize) {
        cb();
      }
    };
  }
}
