import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

export default async function Home() {
  const Posts = await fetchPosts(1, 30);

  const user = await getServerSession(options);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {Posts.posts.length === 0 ? (
          <p className="no-result">No Thread Found</p>
        ) : (
          <>
            {Posts.posts.map((post) => (
              <ThreadCard
                key={post._id}
                postId={post._id}
                currentUserId={user?.user._id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
