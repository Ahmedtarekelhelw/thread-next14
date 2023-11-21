import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/mongoose";

// Register
export const POST = async (req: Request) => {
  try {
    connectToDB();
    const { username, password } = await req.json();

    // check if the req contain username , pass
    if (!username || !password)
      return NextResponse.json(
        { msg: "please fill all fields" },
        { status: 400 }
      );

    // check if user exist in db
    const checkUser = await User.findOne({ username });
    if (checkUser)
      return NextResponse.json(
        {
          msg: "This UserName is already taken",
        },
        { status: 400 }
      );

    // hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create new user and save it in the database
    const newUser = await User.create({ username, password: hashedPass });
    const { password: dbPass, ...user } = newUser._doc;

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        msg: error.message,
      },
      { status: 500 }
    );
  }
};
