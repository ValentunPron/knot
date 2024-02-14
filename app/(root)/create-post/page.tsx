import NewPost from "@/components/forms/NewPost";
import { fecthUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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
        <h1 className="head-text">Створити пост</h1>

        <NewPost userId={userInfo._id} />
      </>
    )
  }

export default Page;