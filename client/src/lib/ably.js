export const BID_EVENT_NAME = 'new_bid';

export function getAuctionChannelName(productId) {
  return `auction-${productId}`;
}
