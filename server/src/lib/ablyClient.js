const Ably = require('ably');

function createNoopAbly() {
  const noopChannel = {
    publish(_event, _data, callback) {
      if (typeof callback === 'function') {
        callback(null);
      }
    },
    subscribe() {},
  };

  return {
    channels: {
      get() {
        return noopChannel;
      },
    },
    connection: {
      on() {},
    },
  };
}

function createAbly() {
  const key = process.env.ABLY_API_KEY;
  if (key) {
    return new Ably.Realtime(key);
  }
  console.warn(
    '[Ably] ABLY_API_KEY is not set; bid events will not be broadcast (OK for local dev).'
  );
  return createNoopAbly();
}

const ably = createAbly();
const bidChannel = ably.channels.get('biddar');

module.exports = { ably, bidChannel };
