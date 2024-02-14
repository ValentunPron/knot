import PostCard from "@/components/cards/PostCard";
import { fetchPost } from "@/lib/actions/post.actions"
import { fecthUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default async function Home() {
  const posts = await fetchPost();
  const user = await currentUser();

  if(!user) {
    redirect('/sing-in');
  }

  const userInfo = await fecthUser(user.id);
  
  
  if(!userInfo?.onboarded) {
    redirect('/onboarding');
  }

  return (
    <>
      <h1 className="head-text text-left">Головна</h1>

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
                    currentUserId={userInfo.id || ""}
                    parentId={post.parentId}
                    content={post.text}
                    image={post.image}
                    author={post.author}
                    likes={post.likes}
                    likedStatus={userInfo.liked.includes(post._id)}
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