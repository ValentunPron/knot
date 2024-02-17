import { fecthUser, fetchUserPost, fetchUserReplies } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import PostCard from "../cards/PostCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
    currentUserId: string,
    accoundId: string,
    accountType: string,
    replies?: boolean,
}

const PostTab = async ({currentUserId, accoundId, accountType, replies = false}: Props) => {
    
    let posts: any;

    console.log(accountType);

    if (accountType === 'Community') {
        posts = await fetchCommunityPosts(accoundId);
        await console.log('421412')
    } else {
        posts = replies ? await fetchUserReplies({userId: accoundId}) : await fetchUserPost({userId: accoundId});
    }

    if(!posts) {
        redirect('/');
    }

    const userInfo = await fecthUser(currentUserId);

    return (
        <section className="mt-9 flex flex-col gap-10">
            {
                posts.posts.length <= 0
                ? <p className="no-result">Користувач ще неписав пости</p>
                : posts.posts.map((post: any) => (
                    <PostCard 
                        key={post._id}
                        id={post._id}
                        currentUserId={currentUserId}
                        parentId={post.parentId}
                        content={post.text}
                        image={post.image}
                        author={
                            accountType === 'User' 
                            ? { name: posts.name, image: posts.image, id: posts.id }
                            : { name: post.author.name, image: post.author.image, id: post.author.id}
                        }
                        likes={post.likes}
                        likedStatus={userInfo.liked.includes(post._id)}
                        community={post.community}
                        createdAt={post.createdAt}
                        comments={post.children}
                    />
                ))
            }
        </section>
    )
}

export default PostTab;