"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";

type UserData = {
  userId?: string;
  username?: string;
  name?: string;
  image?: string;
  bio?: string;
  path?: string;
};
export async function updatedUser(data: UserData): Promise<void> {
  await connectToDB();

  try {
    await User.findByIdAndUpdate(data.userId, {
      ...data,
      username: data.username,
      onboarded: true,
    });

    if (data.path === "/profile/edit") {
      revalidatePath(data.path);
    }
  } catch (error: any) {
    throw new Error(`Field to Create/Update user: ${error.message} `);
  }
}
export async function fetchUser(userId: string) {
  connectToDB();
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error: any) {
    throw new Error(`Field to get user: ${error.message} `);
  }
}

export const fetchUserPosts = async (userId: string) => {
  try {
    connectToDB();

    // TODO: Populate community
    const posts = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return posts;
  } catch (err) {
    throw new Error("Faild to get Posts");
  }
};
