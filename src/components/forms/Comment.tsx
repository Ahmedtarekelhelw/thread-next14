"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CommentValidation } from "@/lib/validations/thread";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Image from "next/image";
import { addComment } from "@/lib/actions/thread.actions";

type Props = {
  postId: string;
  currentUserImage: string;
  currentUserId: string;
};

const Comment = ({ postId, currentUserImage, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    const data = {
      postId,
      commentText: values.thread,
      userId: currentUserId,
      path: pathname,
    };
    await addComment(data);

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center w-full gap-3">
              <FormLabel className="relative w-11 h-11">
                <Image
                  src={currentUserImage}
                  alt="Profile image"
                  fill
                  className="cursor-pointer rounded-full"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  {...field}
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
