// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';

// import Loader from '../../molecules/loader';
// import useAxios from '../../../hooks/useAxios';
// import { Auction } from '../../../types';

// export default function AuctionsPage() {
//     const axios = useAxios();
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const [auctions, setAuctions] = useState<Auction[]>([]);

//     useEffect(() => {
//         const fetchAuctions = async () => {
//             try {
//                 setIsLoading(true);
//                 setError(null);

//                 const response = await axios.get('/auctions/fetch');

//                 if (response.status === 200) {
//                     setAuctions(response.data);
//                 }
//             } catch (error: any) {
//                 const errorMessage =
//                     error.response?.data?.error ||
//                     'An unexpected error occurred. Please try again.';
//                 console.error('Error fetching auctions:', errorMessage);
//                 setError(errorMessage);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchAuctions();
//     }, [axios]);

//     const Card = ({
//         id,
//         image,
//         title,
//         status,
//     }: {
//         id: string;
//         image: string;
//         title: string;
//         status: 'Live' | 'Coming Soon' | 'Closed';
//         description: string;
//     }) => (
//         // md:w-1/3 lg:w-1/4 xl:w-1/5 px-5 lg:mb-10 sm:ml-10
//         <Link to={`/auctions/details/${id}`} className="cursor-pointer h-[500px] w-[300px] ">
//             <div
//                 style={{
//                     backgroundSize: 'cover',
//                     backgroundImage: `url(${image})`,
//                     backgroundRepeat: 'no-repeat',
//                     backgroundPosition: 'center',
//                 }}
//                 className="w-[280px] h-80 bg-pink-700"
//             ></div>
//             p
//             <div className="py-5 flex flex-col ">
//                 <h1 className="text-md md:text-lg font-bold ">{title}</h1>
//                 {status === 'Coming Soon' && (
//                     <small className="bg-secondary rounded-full px-2 text-white w-fit h-fit">
//                         {status}
//                     </small>
//                 )}
//                 {status === 'Live' && (
//                     <div className="rounded-full h-fit flex">
//                         <span className="mr-2">{status}</span>
//                         <div className="bg-primary/10 h-6 w-6 rounded-full animate-pulse flex items-center justify-center">
//                             <div className="bg-primary h-3 w-3 rounded-full animate-pulse " />
//                         </div>
//                     </div>
//                 )}
//                 {status === 'Closed' && (
//                     <small className="bg-red-600 rounded-full px-2 text-white w-fit h-fit">
//                         {status}
//                     </small>
//                 )}
//             </div>
//         </Link>
//     );

//     if (isLoading) {
//         return <Loader />;
//     }
//     // flex flex-col sm:justify-between md:flex-row md:flex-wrap bg-lime-400
//     return (
//         <div className="p-3 sm:p-5 bg-red-400 w-screen">
//             <div className=" bg-lime-400">
//                 {auctions.map((auction) => {
//                     return (
//                         <Card
//                             id={auction.id}
//                             key={auction.id}
//                             image={auction.image}
//                             title={auction.title}
//                             status={auction.status}
//                             description={auction.description}
//                         />
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

// [ COMPONENTS > PAGES > BOOK DETAILS ] ###########################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../../molecules/loader';
import useAxios from '../../../hooks/useAxios';
import { Auction } from '../../../types';

// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................

// 1.2. END ........................................................................................

// 1.3. IMAGES .....................................................................................
// 1.3. END ........................................................................................

// 1.4. DATA .......................................................................................
// 1.4. END ........................................................................................

// 1.5. TYPES ......................................................................................
// 1.5. END ........................................................................................

// 1.5. COMPONENT ..................................................................................

const AuctionsPage = () => {
    // 1.5.1. HOOKS & API CALLS ....................................................................

    const axios = useAxios();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [auctions, setAuctions] = useState<Auction[]>([]);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axios.get('/auctions/fetch');
                if (response.status === 200) {
                    setAuctions(response.data);
                }
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.error ||
                    'An unexpected error occurred. Please try again.';
                console.error('Error fetching auctions:', errorMessage);
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAuctions();
    }, [axios]);

    // 1.5.1. END ..................................................................................

    // 1.5.2. FUNCTIONS & LOCAL VARIABLES ..........................................................
    const Card = ({
        id,
        image,
        title,
        status,
        description,
    }: {
        id: string;
        image: string;
        title: string;
        status: 'Live' | 'Coming Soon' | 'Closed';
        description: string;
    }) => (
        <Link to={`/auctions/details/${id}`} className="cursor-pointer">
            <div
                style={{
                    backgroundImage: `url(${image})`,
                }}
                className="w-full h-64 lg:h-96 bg-cover bg-center "
            />
            <div className="py-4 flex flex-col">
                <h1 className="text-lg font-bold">{title}</h1>
                <p className="text-sm text-gray-600">{description}</p>

                {status === 'Coming Soon' && (
                    <small className="bg-secondary rounded-full px-2 text-white w-fit mt-2">
                        {status}
                    </small>
                )}
                {status === 'Live' && (
                    <div className="rounded-full h-fit flex items-center mt-2">
                        <span className="mr-2">{status}</span>
                        <div className="bg-primary/10 h-6 w-6 rounded-full animate-pulse flex items-center justify-center">
                            <div className="bg-primary h-3 w-3 rounded-full animate-pulse" />
                        </div>
                    </div>
                )}
                {status === 'Closed' && (
                    <small className="bg-red-600 rounded-full px-2 text-white w-fit mt-2">
                        {status}
                    </small>
                )}
            </div>
        </Link>
    );

    // 1.5.2. END ..................................................................................

    // 1.5.3. RENDER ...............................................................................

    if (isLoading) return <Loader />;

    return (
        <div className="p-3 sm:p-5 bg-gray-100 min-h-screen">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {auctions.map((auction) => (
                    <Card
                        key={auction.id}
                        id={auction.id}
                        image={auction.image}
                        title={auction.title}
                        status={auction.status}
                        description={auction.description}
                    />
                ))}
            </div>
        </div>
    );

    // 1.5.3. RENDER ...............................................................................
};

// 1.5. END ........................................................................................

export default AuctionsPage;

// END FILE ########################################################################################
