import PostCard from "@/components/cards/PostCard";
import { fetchPost } from "@/lib/actions/post.actions"
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const posts = await fetchPost();
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {
          posts.post.length === 0 
          ? <p className="no-result">Пости не найдено</p>
          : (
            <>
              {
                posts.post.map((post) => (
                  <PostCard 
                    key={post._id}
                    id={post._id}
                    currentUserId={user?.id || ""}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                  />
                ))
              }
            </>
          )
        }
      </section>
    </>
  )
}