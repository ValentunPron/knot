import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Image from "next/image";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fecthUser } from "@/lib/actions/user.actions";
import PostTab from "@/components/shared/PostTab";
import React from "react";

const Page = async ({params}: { params: {id: string}}) => {
    const user = await currentUser();

    if(!user) {
        return null
    }

    const userInfo = await fecthUser(params.id);

    if(!userInfo?.onboarded) {
        redirect('/onboarding');
    }
    
    

    return (
        <section>
            <ProfileHeader 
                accountId={userInfo.id}
                authUserId={user.id}
                username={userInfo.username}
                name={userInfo.name}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />

            <Tabs defaultValue='posts' className="w-full">
                <TabsList className="tab">
                    {
                        profileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image 
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">{tab.label}</p>

                                {
                                    tab.label === "Posts" && (
                                        <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                            {userInfo?.posts?.length}
                                        </p>
                                    )
                                }
                            </TabsTrigger>
                        ))
                    }
                </TabsList>

                <TabsContent value="posts">
                    <PostTab 
                        currentUserId={user.id}
                        accoundId={userInfo.id}
                        accountType='User'
                    />
                </TabsContent>
            </Tabs>
        </section>
    )
}

export default Page;