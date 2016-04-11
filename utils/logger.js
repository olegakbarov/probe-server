const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

module.exports = bunyan.createLogger({
  name: 'myapp',
  serializers: bunyan.stdSerializers,
  streams: [
    {
      level: 'info',
      type: 'raw',
      stream: prettyStdOut,
    },
    {
      level: 'error',
      path: './errors.log',
    },
  ],
});

