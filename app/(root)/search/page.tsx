import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { fecthUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";
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

    const result = await fetchUsers({
        userId: userInfo.id,
        searchString: searchParams.search,
        pageNumber: 1,
        pageSize: 12
    });

    if(!result) {
        console.log('Користувачів не найдено:', result)
    }

    
    return (
        <section>
            <h1 className="head-text mb-10">Пошук</h1>

            <SearchBar routeType="search"/>

            <div className="mt-14 flex flex-col gap-8">
                {
                    result.users.length === 0 
                    ? <p className="no-result">Користувача не найдено!</p>
                    : result.users.map((person) => (
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