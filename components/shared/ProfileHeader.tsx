'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { followUser } from "@/lib/actions/user.actions";

interface Props {
    accountId: string,
    authUserId: string,
    username: string,
    name: string,
    imgUrl: string,
    bio: string,
    type?: 'User' | 'Community'
}

const ProfileHeader = ({accountId, authUserId, username, name, imgUrl, bio, type}: Props) => {

    const toggleFollowUser = async () => {
        await followUser({userId: accountId, currentUserId: authUserId});
    }

    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-betwen">
                <div className="flex gap-5 items-start w-full flex-col sm:flex-row sm:items-center sm:gap-10">
                    <div className="flex items-center gap-3">
                        <div className="relative h-20 w-20 object-cover">
                            <Image 
                                src={imgUrl}
                                alt='Profile avater'
                                fill
                                className="rounded-full object-cover shadow-2xl"
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                            <p className="text-base-medium text-gray-1">@{username}</p>
                        </div>

                        <Button className='user-card_btn hover:opacity-75 flex sm:hidden ml-5 py-2.5 px-5 text-[16px]' onClick={() => toggleFollowUser()}>Стежити</Button>
                    </div>

                    <div className="h-0.5 w-full bg-dark-3 sm:hidden" />

                    <div className="flex w-full items-center gap-6">
                        <div className="flex gap-6">
                        <Link href={`/followers/${accountId}`} className="text-heading3-bold text-[16px] text-light-2 hover:text-light-3">Читачі: 10</Link>
                        <Link href={`/following/${accountId}`} className="text-heading3-bold text-[16px] text-light-2 hover:text-light-3">Стежить: 10</Link>
                        </div>
                        <Button className='user-card_btn hover:opacity-75 hidden sm:flex' onClick={() => toggleFollowUser()}>Стежити</Button>
                    </div>
                </div>
            </div>

            <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    )
}

export default ProfileHeader;