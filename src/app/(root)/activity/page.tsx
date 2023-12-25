import { options } from "@/app/api/auth/[...nextauth]/options";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getServerSession(options);
  if (!user) return null;

  const userInfo = await fetchUser(user.user._id);

  if (!userInfo.onboarded) redirect("/onboarding");

  //   getActivity
  const activity = await getActivity(userInfo._id);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((ac) => (
              <Link key={ac._id} href={`/thread/${ac.parentId}`}>
                <article className="activity-card">
                  <div className="w-11 h-11 relative">
                    <Image
                      src={ac.author.image}
                      alt="profile pic"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="!text-small-regular text-light-1 ">
                    <span className="mr-1 text-primary-500">
                      {ac.author.name}
                    </span>
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
