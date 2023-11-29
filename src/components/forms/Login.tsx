"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
const Login = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    // if the request is ok
    if (res?.ok) {
      if (!session?.user?.onboarded) {
        router.push("/onboarding");
        return;
      }
      router.push("/");
    } else {
      toast.error(res?.error);
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
          Sign In
        </button>
        <Link href="/sign-up" className="text-white">
          Don`t have an account ?
          <span className="text-primary-500"> Sign Up</span>
        </Link>
      </form>
    </div>
  );
};

export default Login;
