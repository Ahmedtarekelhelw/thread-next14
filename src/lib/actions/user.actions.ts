"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

type UserData = {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
};
export async function updatedUser(data: UserData): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: data.userId },
      {
        ...data,
        username: data.username.toLowerCase(),
        onboarded: true,
      },
      { upsert: true }
    );

    if (data.path === "/profile/edit") {
      revalidatePath(data.path);
    }
  } catch (error: any) {
    throw new Error(`Field to Create/Update user: ${error.message} `);
  }
}
export async function fetchUser(userId: string) {
  try {
    connectToDB();
    const user = await User.findOne({ id: userId });
    return user;
  } catch (error: any) {
    throw new Error(`Field to get user: ${error.message} `);
  }
}
