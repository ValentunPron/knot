import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import AccountProfile from "@/components/forms/AccountProfile";
import { fecthUser } from "@/lib/actions/user.actions";

// Copy paste most of the code as it is from the /onboarding

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fecthUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <>
      <h1 className='head-text'>Редагування профію</h1>

      <section className='mt-12'>
        <AccountProfile user={userData} btnTitle='Continue' editAccount={true} />
      </section>
    </>
  );
}

export default Page;