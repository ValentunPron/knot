import { fetchUserPost } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import PostCard from "../cards/PostCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
    currentUserId: string,
    accoundId: string,
    accountType: string,
}

const PostTab = async ({currentUserId, accoundId, accountType}: Props) => {
    
    let posts: any;

    if (accountType === 'Community') {
        posts = await fetchCommunityPosts(accoundId);
    } else {
        posts = await fetchUserPost(accoundId);
    }

    if(!posts) {
        redirect('/');
    }

    return (
        <section className="mt-9 flex flex-col gap-10">
            {posts.posts.map((post: any) => (
                <PostCard 
                    key={post._id}
                    id={post._id}
                    currentUserId={currentUserId}
                    parentId={post.parentId}
                    content={post.text}
                    author={
                        accountType === 'User' 
                        ? { name: posts.name, image: posts.image, id: posts.id }
                        : { name: post.author.name, image: post.author.image, id: post.author.id}
                    }
                    likes={post.likes}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                />
            ))}
        </section>
    )
}

export default PostTab;