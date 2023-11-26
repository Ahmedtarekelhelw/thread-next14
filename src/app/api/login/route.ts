import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req: Request) => {
  try {
    connectToDB();
    const { username, password } = await req.json();

    // check if user exist in db
    const checkUser = await User.findOne({ username });
    if (!checkUser)
      return NextResponse.json(
        { msg: "This user doesn`t exist please register first" },
        { status: 404 }
      );

    // check if the pass is correct
    const checkPass = await bcrypt.compare(password, checkUser.password);

    if (!checkPass)
      return NextResponse.json(
        { msg: "This password is Incorrect" },
        { status: 400 }
      );

    // generate jwt
    const token = jwt.sign({ id: checkUser._id }, process.env.JWT_KEY);

    const { password: dbPass, ...user } = checkUser._doc;

    return NextResponse.json({ user, token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "something went wrong" }, { status: 500 });
  }
};
