import PostCard from "@/components/cards/PostCard";
import Pagination from "@/components/shared/Pagination";
import { fetchPost } from "@/lib/actions/post.actions"
import { fecthUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import React from "react";

export default async function Home({searchParams} : {searchParams: { [key: string]: string | undefined }}) {
  const posts = await fetchPost(
    searchParams.page ? +searchParams.page : 1,
    15
  );
  const user = await currentUser();

  const userInfo = await fecthUser(user !== null ? user.id : '');

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
                    currentUserId={userInfo !== null ? userInfo.id : null}
                    parentId={post.parentId}
                    content={post.text}
                    image={post.image}
                    author={post.author}
                    likes={post.likes}
                    likedStatus={userInfo !== null ? userInfo.liked.includes(post._id): false}
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

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={posts.isNext}
      />
    </>
  )
}