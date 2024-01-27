import CreatePost from "@/components/forms/CreatePost";
import { fecthUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

async function Page() {
    const user = await currentUser();

    if(!user) {
        return null
    }

    const userInfo = await fecthUser(user.id);

    if(!userInfo?.onboarded) {
        redirect('/onboarding');
    }
    
    return (
      <>
        <h1 className="head-text">Create Post</h1>

        <CreatePost userId={user.id} />
      </>
    )
  }

export default Page;