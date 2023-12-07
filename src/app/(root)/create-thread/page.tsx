import { options } from "@/app/api/auth/[...nextauth]/options";
import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(options);

  if (!session?.user) redirect("/sign-in");
  // const userInfo = await fetchUser(session?.user._id);

  if (!session?.user.onboarded) redirect("/onboarding");
  return (
    <>
      <h1 className="head-text">Create Thread</h1>;
      <PostThread userId={session?.user._id} />
    </>
  );
};

export default page;
