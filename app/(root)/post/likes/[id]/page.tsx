import PostCard from "@/components/cards/PostCard";
import UserCard from "@/components/cards/UserCard";
import Comment from "@/components/forms/Comment";
import { fetchPostById } from "@/lib/actions/post.actions";
import { fecthUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({params}: {params: {id: string}}) => {
    if(!params.id) {
        return null
    }

    const user = await currentUser();

    if (!user) {
        return null
    }

    const userInfo = await fecthUser(user.id);

    if (!userInfo?.onboarded) {
        redirect('/onboarding');
    }

    const post = await fetchPostById(params.id);
    
    return (
        <section className="relative">
           <div>
            <PostCard 
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                image={post.image}
                author={post.author}
                likes={post.likes}
                likedStatus={userInfo.liked.includes(post._id)}
                community={post.community}
                createdAt={post.createdAt}
                isEdit={post.isEdit}
                comments={post.children}
            />
           </div>

           <div className="mt-7">
                <Comment
                    postId={post.id}
                    currentUserImage={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
           </div>

           <div className="flex flex-col gap-6 mt-10">
            {post.likes.map((authorLike: any) => (
                <UserCard 
                    key={authorLike.id}
                    id={authorLike.id}
                    name={authorLike.name}
                    username={authorLike.username}
                    imgUrl={authorLike.image}
                    personType='User'
                />
            )
            )}
           </div>
        </section>
    )
}

export default Page;