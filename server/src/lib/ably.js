const Ably = require('ably');

const BID_EVENT_NAME = 'new_bid';

function getAuctionChannelName(productId) {
  return `auction-${productId}`;
}

let restClient;

function getRestClient() {
  if (!restClient) {
    restClient = new Ably.Rest({ key: process.env.ABLY_API_KEY });
  }
  return restClient;
}

async function publishBid(productId, payload) {
  const channel = getRestClient().channels.get(getAuctionChannelName(productId));
  await channel.publish(BID_EVENT_NAME, payload);
}

module.exports = {
  BID_EVENT_NAME,
  getAuctionChannelName,
  publishBid,
};
