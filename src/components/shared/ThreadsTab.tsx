import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

type Props = {
  currentUserId: string;
  accountId: string;
  accountType: string;
};

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let posts = await fetchUserPosts(accountId);

  if (!posts) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {posts.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          postId={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? {
                  name: posts.name,
                  image: posts.image,
                  id: posts.id,
                }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          } // TODO
          community={thread.community} // TODO
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
