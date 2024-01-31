import AccountProfile from "@/components/forms/AccountProfile";
import { fecthUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

async function Page() {
    const user = await currentUser();

    if (!user) {
        return null
    }

    const userInfo = await fecthUser(user.id);

    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || '',
        bio: userInfo?.bio || '',
        image: userInfo?.image || user?.imageUrl
    }

    return (
        <main className="mx-auto flex flex-col max-w-3xl justify-stretch px-5 py-5 sm:px-10 sm:py-10">
            <h1 className="head-text">Заповення профілю</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Заповніть свій профіль зараз, щоб використовувати Knot
            </p>

            <section className="mt-9 bg-dark-2 p-5 sm:p-10">
                <AccountProfile 
                    user={userData}
                    btnTitle="Continue"  
                />
            </section>
        </main>
    )
}

export default Page;