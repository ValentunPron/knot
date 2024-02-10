import { fecthUser, fetchLikedPost, fetchUserPost } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import PostCard from "../cards/PostCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
    currentUserId: string,
    accoundId: string,
    accountType: string,
}

const LikedTab = async ({currentUserId, accoundId, accountType}: Props) => {
    
    const posts = await fetchLikedPost(accoundId);

    if(!posts) {
        redirect('/');
    }

    const userInfo = await fecthUser(currentUserId);

    return (
        <section className="mt-9 flex flex-col gap-10">
            {posts.liked.map((post: any) => (
                <PostCard 
                    key={post._id}
                    id={post._id}
                    currentUserId={currentUserId}
                    parentId={post.parentId}
                    content={post.text}
                    author={
                        { name: post.author.name, image: post.author.image, id: post.author.id}
                    }
                    likes={post.likes}
                    likedStatus={userInfo.liked.includes(post._id)}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                />
            ))}
        </section>
    )
}

export default LikedTab;