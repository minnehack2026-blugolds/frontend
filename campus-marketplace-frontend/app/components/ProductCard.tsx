'use client';

import { useRouter } from 'next/navigation';

interface ProductCardProps {
    id: number;
    title: string;
    price: number;
    image: string;
    seller: {
        name: string;
        university: string;
        rating: number;
        reviewCount: number;
    };
}

export default function ProductCard({ id, title, price, image, seller}: ProductCardProps){
    const router = useRouter();
    
    const handleClick = () => {
        router.push(`/product/${id}`);
    };

    return (
        <div onClick={handleClick} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="relative aspect-square">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-3">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                    {title}
                </h3>

                <p className="text-lg font-bold text-green-600 mb-2">
                    ${price}
                </p>

                <div className="flex items-center gap-1 text-xs text-gray-900">
                    <span>{seller.name}</span>
                    <span>.</span>
                    <span className="flex items-center gap-0.5">
                        <span className="text-yellow-400">★</span>
                        <span>{seller.rating}</span>
                    </span>
                </div>
            </div>
        </div>
    );    
}