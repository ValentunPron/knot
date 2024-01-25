import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

async function Page() {
    const user = await currentUser();

    const userInfo = {};

    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || '',
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl
    }

    return (
        <main className="mx-auto flex flex-col max-w-3xl justify-stretch px-10 py-20">
            <h1 className="head-text">Заповення профілю</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Заповніть свій профіль зараз, щоб використовувати Knot
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile 
                    user={userData}
                    btnTitle="Continue"  
                />
            </section>
        </main>
    )
}

export default Page;