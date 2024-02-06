import { fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import UserCard from "../cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";

async function RightSidebar() {
    const user = await currentUser();
    
    if (!user) {
        return null
    }

    const recommendUsers = await fetchUsers({userId: user.id, pageSize: 4});
    const reccomentComumunities = await fetchCommunities({pageSize: 4});
    
    return (
        <section className="custom-scrollbar rightsidebar">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Рекомендовані користувачі</h3>
                <div className="mt-4 flex flex-col gap-6">
                    {
                        !recommendUsers.users && recommendUsers.users < 0
                        ? <p className="no-result">Користувачів не найдено</p>
                        : recommendUsers.users.map((user) => (
                            <UserCard 
                                key={`reccomentUser_${user.id}`}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                imgUrl={user.image}
                                personType='User'
                                adaptiveNames={true}
                            />
                        ))
                    }
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Рекомендовані спільноти</h3>
                <div className="mt-4 flex flex-col gap-6">
                    {
                        !reccomentComumunities.communities && reccomentComumunities.communities < 0
                        ? <p className="no-result">Користувачів не найдено</p>
                        : reccomentComumunities.communities.map((community) => (
                            <UserCard 
                                key={`reccomentCommunity_${community.id}`}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                imgUrl={community.image}
                                personType='Community'
                                adaptiveNames={true}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default RightSidebar;