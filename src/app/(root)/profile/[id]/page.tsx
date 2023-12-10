import { options } from "@/app/api/auth/[...nextauth]/options";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

const Page = async ({ params }: Props) => {
  const session = await getServerSession(options);

  if (!session?.user) return null;

  const userInfo = await fetchUser(params.id);

  if (!userInfo.onboarded) redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        accountId={userInfo._id}
        authUserId={session?.user._id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object=contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-light-2 text-tiny-medium ">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              className="w-full text-light-1"
              key={`content-${tab.label}`}
              value={tab.value}
            >
              <ThreadsTab
                currentUserId={session?.user._id}
                accountId={userInfo._id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
