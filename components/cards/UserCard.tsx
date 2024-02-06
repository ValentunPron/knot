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
    adaptiveNames?: boolean
}

const UserCard = ({id, name, username, imgUrl, personType, adaptiveNames = false}: Props) => {
    const router = useRouter();

    function truncateText(text: string) {
        if (text.length > 13) {
            return text.slice(0, 13) + '...';
        }
        return text;
    }

    return (
        <article className="user-card">
            <Link href={personType === 'Community' ? `/communities/${id}` : `/profile/${id}`} className="user-card_avatar">
                <Image 
                    src={imgUrl}
                    alt="Person avatar"
                    width={48}
                    height={48}
                    className='rounded-full object-cover w-[48px] h-[48px]'
                />

                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold text-light-1'>{adaptiveNames ? truncateText(name) : name}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>

                <Button className='user-card_btn' onClick={() => router.push(personType === 'Community' ? `/communities/${id}` : `/profile/${id}`)}>Переглянути</Button>
            </Link>
        </article>
    )
}

export default UserCard