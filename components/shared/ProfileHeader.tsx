'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { followUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

import editImage from '@/assets/edit.svg';

interface Props {
    accountId: string,
    authUserId: string,
    username: string,
    name: string,
    imgUrl: string,
    bio: string,
    followers?: number,
    following?: number,
    checkFollower?: boolean,
    type?: 'User' | 'Community'
}


const ProfileHeader = ({accountId, authUserId, username, name, imgUrl, bio, followers, following, checkFollower, type}: Props) => {

    const router = useRouter();

    const toggleFollowUser = async () => {
        await followUser({userId: accountId, currentUserId: authUserId});
        router.refresh();
    }

    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-betwen">
                <div className="flex gap-5 items-start w-full flex-col sm:flex-row sm:items-center">
                    <div className="flex w-full items-center gap-3">
                        <div className="relative h-20 w-20 object-cover">
                            <Image 
                                src={imgUrl}
                                alt='Profile avater'
                                fill
                                className="rounded-full object-cover shadow-2xl"
                            />
                        </div>

                        <div className="flex-1 w-full">
                            <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                            <p className="text-base-medium text-gray-1">@{username}</p>
                        </div>
                    </div>
                    {
                        type === 'User' && 
                        <>
                            <div className="h-0.5 w-full bg-dark-3 sm:hidden" />
                            
                            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row w-full">
                                <div className="flex justify-center gap-6">
                                    <Link href={`/followers/${accountId}`} className="font-bold text-[14px] whitespace-nowrap text-light-2 hover:opacity-85">Читачі: {followers}</Link>
                                    <Link href={`/following/${accountId}`} className="font-bold text-[14px] whitespace-nowrap text-light-2 hover:opacity-85">Стежить: {following}</Link>
                                </div>

                                <div className="flex items-center justify-center mx-auto gap-6">
                                    { 
                                    accountId !== authUserId 
                                    && 
                                        <Button className='user-card_btn hover:opacity-75 w-[300px] sm:w-auto ' onClick={() => toggleFollowUser()}>
                                            {checkFollower ? 'Не стежити' : 'Стежити'}
                                        </Button> 
                                    } 
                                    {
                                        accountId === authUserId &&
                                        <Link href='/profile/edit'>
                                            <Button className="bg-dark-2 flex gap-4 w-[300px] sm:w-auto hover:bg-dark-3">
                                                <Image 
                                                    src={editImage}
                                                    alt="edit"
                                                    width={16}
                                                    height={16}
                                                />
                                                Редагувати
                                            </Button>
                                        </Link>
                                    }
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>

            {
                bio && <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
            }

            <div className="mt-6 h-0.5 w-full bg-dark-3" />
        </div>
    )
}

export default ProfileHeader;