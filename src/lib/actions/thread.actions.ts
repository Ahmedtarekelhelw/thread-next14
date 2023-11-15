"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

type CommentParams = {
  postId: string;
  commentText: string;
  userId: string;
  path: string;
};

export const createThread = async ({
  text,
  author,
  communityId,
  path,
}: Params) => {
  try {
    connectToDB();
    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update user model

    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    revalidatePath(path);
  } catch (error) {}
};

export const fetchPosts = async (pageNumber = 1, pageSize = 20) => {
  try {
    connectToDB();

    // Calc the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // fetch the posts that have no parents
    // because the child is a comments
    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    // this exec is recommended
    // take a look at this https://stackoverflow.com/questions/31549857/mongoose-what-does-the-exec-function-do
    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount * posts.length;

    return { posts, isNext };
  } catch (error) {
    throw new Error("Faild to fetch Posts");
  }
};

export const fetchPostById = async (postId: string) => {
  try {
    connectToDB();

    const post = Thread.findById(postId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return post;
  } catch (error) {
    throw new Error("Faild to fetch Post");
  }
};

export const addComment = async ({
  postId,
  commentText,
  userId,
  path,
}: CommentParams) => {
  try {
    connectToDB();

    // find the original thread by its Id
    const originalThread = await Thread.findById(postId);

    if (!originalThread) throw new Error("Thread not found");

    //Create a new Thread with the comment text
    const comment = new Thread({
      text: commentText,
      author: userId,
      parentId: postId,
    });

    const savedComment = await comment.save();

    //updated the original thread to include the new comment
    originalThread.children.push(savedComment._id);

    // Save the original thread

    await originalThread.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error("Faild to adding comment to thread");
  }
};
