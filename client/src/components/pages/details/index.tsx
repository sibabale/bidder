import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import Loader from '../../molecules/loader';
import { Auction } from '../../../types';
import Alert from '../../molecules/alert';
import AddIcon from '../../atoms/icons/add';
import MinusIcon from '../../atoms/icons/minus';

const ArtSalePage = () => {
    const { id } = useParams<{ id: string }>();
    const axios = useAxios();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/auctions/fetch/${id}`);

                if (response.status === 200) {
                    setAuction(response.data);
                } else {
                    setError('Failed to fetch auction details.');
                }
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.error || 'An error occurred. Please try again.';
                console.error('Error fetching auction:', errorMessage);
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuction();
    }, [id, axios]);

    if (isLoading) return <Loader />;

    if (error) {
        return (
            <div className="px-3 md:px-5">
                <Alert message={error} isVisible={error ? true : false} />
            </div>
        );
    }

    if (!auction) return <div>Auction not found.</div>;

    return (
        <div className="p-3 md:p-5 flex flex-col md:flex-row">
            <div className="flex justify-center items-center md:w-1/2 lg:w-2/3 xl:w-4/5 bg-gray-100">
                <div
                    style={{ backgroundImage: `url(${auction.image})` }}
                    className="bg-cover bg-center w-full max-w-[656px] h-[427px] md:h-[624px] max-h-[624px] min-h-[200px]" // Ensure the image is visible on small devices
                />
            </div>

            <div className="md:pl-5 md:w-1/2 lg:w-1/3">
                <div className="my-5 md:mt-0">
                    <h1 className="text-3xl font-bold">{auction.title}</h1>
                    <h1 className="text-2xl font-bold text-secondary">Choose Your Weapon</h1>

                    <div className="mt-5">
                        <small className="mr-2 text-secondary">Current Bid:</small>
                        <h3 className="mt-3 text-2xl font-semibold">R{auction.startPrice}</h3>
                    </div>
                    <div className="mt-5 ">
                        <div className="flex items-center">
                            <span className="material-symbols-sharp text-red-500 mr-1">timer</span>
                            <small className="mr-2 text-red-500">Time remaining</small>
                        </div>
                        <h5 className="mt-3 text-md font-semibold text-red-500">01:00:00</h5>
                    </div>
                </div>
                <div className="w-full">
                    <div className="my-5 w-full lg:w-1/2 flex items-center justify-between">
                        <MinusIcon fill="black" />

                        <span className="mx-3 text-xl font-semibold">R{auction.startPrice}</span>
                        <AddIcon fill="black" />
                    </div>

                    <button className="w-full lg:w-1/2 bg-black text-white px-6 py-3 hover:bg-gray-800">
                        <span>Place bid</span>
                    </button>
                </div>

                <div className="hidden">
                    <button className="bg-black text-white px-6 py-3 hover:bg-gray-800">
                        <span>Purchase</span>
                    </button>
                    <button className="border border-black px-6 py-3 hover:bg-gray-200">
                        <span>Make an Offer</span>
                    </button>
                </div>

                <div className="my-5">
                    <p>{auction.description}</p>
                </div>

                <div className="border-t pt-4 space-y-2">
                    <p className="font-semibold">Shipping and taxes</p>
                    <p>Covered by the Bidder Guarantee when you check out with Artsy.</p>
                </div>
            </div>
        </div>
    );
};

export default ArtSalePage;
