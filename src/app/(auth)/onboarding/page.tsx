import { options } from "@/app/api/auth/[...nextauth]/options";
import AccountProfile from "@/components/forms/AccountProfile";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const page = async () => {
  const user = await getServerSession(options);

  if (user?.user.onboarded) redirect("/");

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete Your Profile Now to use Threads
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile
          user={{
            _id: user?.user._id,
            username: user?.user.username,
            name: user?.user.name,
            bio: user?.user.bio,
            image: user?.user.image,
          }}
          btnTitle="Continue"
        />
      </section>
    </main>
  );
};

export default page;
