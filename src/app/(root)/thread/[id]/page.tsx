import { options } from "@/app/api/auth/[...nextauth]/options";
import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchPostById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};
const Page = async ({ params }: Props) => {
  if (!params.id) return null;

  const session = await getServerSession(options);

  // const user = await currentUser();

  if (!session?.user) return null;

  const userInfo = await fetchUser(session?.user._id);

  if (!userInfo.onboarded) redirect("/onboarding");

  const post = await fetchPostById(params.id);

  return (
    <section className="relatvie">
      <div>
        <ThreadCard
          postId={post._id}
          currentUserId={session?.user._id || ""}
          parentId={post.parentId}
          content={post.text}
          author={post.author}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          postId={post.id}
          currentUserImage={userInfo.image}
          currentUserId={userInfo._id}
        />
      </div>

      <div className="mt-10">
        {post.children?.map((child: any) => (
          <ThreadCard
            key={child._id}
            postId={child._id}
            currentUserId={session?.user?._id || ""}
            parentId={child.parentId}
            content={child.text}
            author={child.author}
            community={child.community}
            createdAt={child.createdAt}
            comments={child.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
