import { reccomendUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import UserCard from "../cards/UserCard";
import { fetchCommunities, reccomendCommunity } from "@/lib/actions/community.actions";
import React from "react";

async function RightSidebar() {
    const user = await currentUser();
    
    if (!user) {
        return null
    }

    const recommendUsersArray = await reccomendUsers(user.id);
    const reccomentComumunitiArray = await reccomendCommunity(user.id);
    
    return (
        <section className={`custom-scrollbar rightsidebar`}>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Рекомендовані користувачі</h3>
                <div className="mt-4 flex flex-col gap-6">
                    {
                        recommendUsersArray && recommendUsersArray.length <= 0
                        ? <p className="no-result">Користувачів не найдено</p>
                        : recommendUsersArray.map((user) => (
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
                        reccomentComumunitiArray && reccomentComumunitiArray.length <= 0
                        ? <p className="no-result">Спільноти не найдено</p>
                        : reccomentComumunitiArray.map((community) => (
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