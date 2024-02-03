'use client'

import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
    id: string,
    name: string,
    username: string,
    imgUrl: string,
    personType: string
}

const UserCard = ({id, name, username, imgUrl, personType}: Props) => {
    const router = useRouter();

    return (
        <article className="user-card">
            <Link href={`/profile/${id}`} className="user-card_avatar">
                <Image 
                    src={imgUrl}
                    alt="Person avatar"
                    width={48}
                    height={48}
                    className='rounded-full h-[48px]'
                />

                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>

                <Button className='user-card_btn' onClick={() => router.push(`/profile/${id}`)}>Перегляд</Button>
            </Link>
        </article>
    )
}

export default UserCard