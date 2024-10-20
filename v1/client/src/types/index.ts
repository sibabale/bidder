export interface Auction {
    id: string;
    image: string;
    title: string;
    status: 'Live' | 'Coming Soon' | 'Closed';
    startPrice: string;
    description: string;
}
