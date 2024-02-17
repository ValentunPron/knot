import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Image from "next/image";
import { communityTabs } from "@/constants";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostTab from "@/components/shared/PostTab";
import { fetchCommunityDetails, fetchCommunityPosts } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

const Page = async ({params}: { params: {id: string}}) => {
    const user = await currentUser();

    if(!user) {
        return null
    }

    const communityDetails = await fetchCommunityDetails(params.id);

    if(!communityDetails) {
        return null
    }

    const communityPosts = await fetchCommunityPosts(communityDetails._id);

    return (
        <section>
            <ProfileHeader 
                accountId={communityDetails.id}
                authUserId={user.id}
                username={communityDetails.username}
                name={communityDetails.name}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />

            <Tabs defaultValue='posts' className="w-full">
                <TabsList className="tab">
                    {
                        communityTabs.map((tab) => (
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
                                            {communityDetails?.posts?.length}
                                        </p>
                                    )
                                }
                            </TabsTrigger>
                        ))
                    }
                </TabsList>

                <TabsContent value="posts" className="w-full text-light-1">
                    <PostTab 
                        currentUserId={user.id}
                        accoundId={communityPosts._id}
                        accountType='Community'
                    />
                </TabsContent>
                
                <TabsContent value="members" className="w-full text-light-1">
                    <section className="mt-9 flex flex-col gap-10">
                        {
                            communityDetails?.members.map((member: any) => (
                                <UserCard
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.image}
                                    personType="User"
                                />
                            ))
                        }
                    </section>
                </TabsContent>
            </Tabs>
        </section>
    )
}

export default Page;