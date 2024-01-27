import { fetchPost } from "@/lib/actions/post.actions"

export default async function Home() {
  const posts = await fetchPost();

  console.log(posts);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
    </>
  )
}