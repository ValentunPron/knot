import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { fecthUser } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";
import SearchBar from "@/components/shared/SearchBar";

const Page = async ({searchParams}: {searchParams: {[key: string]: string | undefined}}) => {
    const user = await currentUser();

    if(!user) {
        return null
    }

    const userInfo = await fecthUser(user.id);

    if(!userInfo?.onboarded) {
        redirect('/onboarding');
    }

    const result = await fetchCommunities({
        searchString: searchParams.search,
        pageNumber: 1,
        pageSize: 12
    });

    if(!result) {
        console.log('Групи не найдено:', result)
    }

    
    return (
        <section>
            <h1 className="head-text mb-10">Пошук</h1>

            <SearchBar routeType="communities"/>

            <div className="mt-14 flex flex-col gap-8">
                {
                    result.communities.length === 0 
                    ? <p className="no-result">Групи не найдено!</p>
                    : result.communities.map((community) => (
                        <CommunityCard 
                            key={community.id}
                            id={community.id}
                            name={community.name}
                            username={community.username}
                            imgUrl={community.image}
                            bio={community.bio}
                            members={community.members}
                        />
                    ))
                }
            </div>
        </section>
    )
}

export default Page;