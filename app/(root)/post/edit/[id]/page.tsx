import NewPost from "@/components/forms/NewPost";
import { fetchPostById } from "@/lib/actions/post.actions";
import { fecthUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fecthUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const post = await fetchPostById(params.id);

  return (
    <>
      <h1 className="head-text">Редагування поста</h1>

      <NewPost
        userId={userInfo._id}
        postId={post.id}
        postText={post.text}
        postImage={post.image}
      />
    </>
  );
};

export default Page;