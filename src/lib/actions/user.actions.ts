"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

type UserData = {
  userId?: string;
  username?: string;
  name?: string;
  image?: string;
  bio?: string;
  path?: string;
};

type SearchUsers = {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
};
export const updatedUser = async (data: UserData): Promise<void> => {
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
};
export const fetchUser = async (userId: string) => {
  connectToDB();
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error: any) {
    throw new Error(`Field to get user: ${error.message} `);
  }
};

export const fetchUserPosts = async (userId: string) => {
  try {
    connectToDB();

    // TODO: Populate community
    const posts = await User.findById(userId).populate({
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

export const fetchUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: SearchUsers) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = { id: { $ne: userId } };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch Users ${error.message}`);
  }
};

export const getActivity = async (userId: string) => {
  try {
    connectToDB();

    // find all thread created by the user
    const userThreads = await Thread.find({ author: userId });

    // collect all child thread id (replies) from the children field
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({ path: "author", model: User, select: "name image _id" });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch Users activity ${error.message}`);
  }
};
