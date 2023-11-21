"use client";

import axios from "axios";
import Link from "next/link";
import { FormEvent } from "react";

const SignUp = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const res = await axios.post("/api/auth/register", {
        username,
        password,
      });
    } catch (error) {
      console.log("fdsf", error);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-dark-2 flex flex-col gap-10 p-5 rounded-md w-1/2"
      >
        <input
          name="username"
          type="text"
          placeholder="UserName"
          className="p-2 rounded-md outline-none no-focus"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="p-2 rounded-md outline-none no-focus"
        />
        <button
          className="p-2 rounded-md outline-none no-focus bg-primary-500"
          type="submit"
        >
          Sign Up
        </button>
        <Link href="/sign-in" className="text-white">
          Have an account ? <span className="text-primary-500">Log in now</span>
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
