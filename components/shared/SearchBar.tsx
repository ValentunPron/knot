"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { Input } from '../ui/input';
import searchImage from '@/assets/search-gray.svg';

function SearchBar({routeType}: {routeType: string}) {
    const router = useRouter();
    const [searchValue, setSearchValue] = React.useState('');

    React.useEffect(() => {
        setTimeout(() => {
            if (searchValue) {
                router.push(`/${routeType}?search=${searchValue}`);
            } else {
                router.push(`/${routeType}`); 
            }
        }, 200);
    }, [routeType, searchValue])


    return (
        <div className="mt-4 flex items-center w-full bg-dark-3 rounded-lg py-2 px-4">
            <Image 
                src={searchImage}
                alt='Пошук'
                width={24} height={24}
                className='object-cover'
            />
            <Input 
                placeholder="Пошук..."
                className="bg-transparent border-none no-focus text-light-3"
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    )
}

export default SearchBar