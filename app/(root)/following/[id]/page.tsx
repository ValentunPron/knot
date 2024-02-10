import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import ProfileHeader from "@/components/shared/ProfileHeader";
import { checkFollowedUser, fetchFollowerAndFollowing } from "@/lib/actions/user.actions";
import React from "react";
import UserCard from "@/components/cards/UserCard";

const Page = async ({params}: { params: {id: string}}) => {
    const user = await currentUser();

    if(!user) {
        return null
    }

    const userInfo = await fetchFollowerAndFollowing(params.id);

    if(!userInfo?.onboarded) {
        redirect('/onboarding');
    }

    const checkFollower = await checkFollowedUser(user.id, params.id);

    return (
        <section>
            <ProfileHeader 
                accountId={userInfo.id}
                authUserId={user.id}
                username={userInfo.username}
                name={userInfo.name}
                imgUrl={userInfo.image}
                followers={userInfo.followers.length}
                following={userInfo.following.length}
                checkFollower={checkFollower}
                bio={userInfo.bio}
            />

            
            <div className="mt-14 flex flex-col gap-8">
                {
                    userInfo.following.length === 0 
                    ? <p className="no-result">У користувача немає стежень</p>
                    : userInfo.following.map((person: any) => (
                        <UserCard 
                            key={person.id}
                            id={person.id}
                            name={person.name}
                            username={person.username}
                            imgUrl={person.image}
                            personType='User'
                        />
                    ))
                }
            </div>
        </section>
    )
}

export default Page;