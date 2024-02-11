import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { fecthUser, getActivity } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";

const Page = async () => {
    const user = await currentUser();

    if(!user) {
        return null
    }

    const userInfo = await fecthUser(user.id);

    if(!userInfo?.onboarded) {
        redirect('/onboarding');
    }

    const activity = await getActivity(userInfo._id);

    return (
        <section>
            <h1 className="head-text mb-10">Активність</h1>

            <section className="mt-10 flex flex-col gap-5">
                {
                    activity.comments.length > 0 && (
                        activity.comments.map((active) => (
                            <Link key={active._id} href={`/post/${active.parentId}`}>
                                <article className="activity-card">
                                    <Image 
                                        src={active.author.image}
                                        alt="Person avatar"
                                        width={32}
                                        height={32}
                                        className='rounded-full object-cover h-[32px]'
                                    />

                                    <p className="!text-small-regular text-light-1">
                                        <span className="mr-1 text-primary-500">{active.author.name}</span>
                                        {"  "}
                                        відповів на ваш пост
                                    </p>
                                </article>
                            </Link>
                        ))
                    )
                }

                {
                    
                    activity.followed.length > 0 && (
                        activity.followed.map((active) => (
                            <Link key={active._id} href={`/profile/${active.id}`}>
                                <article className="activity-card">
                                    <Image 
                                        src={active.image}
                                        alt="Person avatar"
                                        width={32}
                                        height={32}
                                        className='rounded-full object-cover h-[32px]'
                                    />

                                    <p className="!text-small-regular text-light-1">
                                        <span className="mr-1 text-primary-500">{active.name}</span>
                                        {"  "}
                                        стежить за вами
                                    </p>
                                </article>
                            </Link>
                        ))
                    )
                }

                {
                    (activity.comments.length === 0 && activity.followed.length === 0) && <p className="!text-base-regular text-light-3">Немає активонсті</p>
                }
            </section>
        </section>
    )
}

export default Page;