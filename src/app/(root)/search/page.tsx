import { options } from "@/app/api/auth/[...nextauth]/options";
import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getServerSession(options);
  if (!user) return null;

  const userInfo = await fetchUser(user.user._id);

  if (!userInfo.onboarded) redirect("/onboarding");

  // Fetch Users
  const result = await fetchUsers({
    userId: user.user._id,
    searchString: "",
    pageNumber: 1,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* TODO */}
      {/* Search bar */}

      {/* user cards */}
      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          result.users.map((person) => (
            <UserCard
              key={person._id}
              id={person._id}
              name={person.name}
              username={person.username}
              imgUrl={person.image}
              personType="User"
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Page;
