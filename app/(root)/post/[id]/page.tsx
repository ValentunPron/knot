import PostCard from "@/components/cards/PostCard";
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
                comments={post.children}
                isFullPost={true}
            />
           </div>

           <div className="mt-7">
                <Comment
                    postId={post.id}
                    currentUserImage={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
           </div>

           <div className="mt-10">
            {post.children.map((postItem: any) => (
                <PostCard 
                    key={postItem._id}
                    id={postItem._id}
                    currentUserId={userInfo?.id || ""}
                    parentId={postItem.parentId}
                    content={postItem.text}
                    author={postItem.author}
                    likes={postItem.likes}
                    likedStatus={userInfo.liked.includes(postItem._id)}
                    community={postItem.community}
                    createdAt={postItem.createdAt}
                    comments={postItem.children}
                    isComment
                />
            ))}
           </div>
        </section>
    )
}

export default Page;