"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
const LeftSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user._id;

  const handleNavigate = (route: string) => {
    if (route === "/profile") {
      router.push(`${route}/${userId}`);
    } else {
      router.push(route);
    }
  };

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive = pathname.split("/")[1] === link.route.split("/")[1];

          return (
            <div
              onClick={() => handleNavigate(link.route)}
              key={link.label}
              className={`leftsidebar_link hover:bg-primary-500 duration-300 cursor-pointer ${
                isActive && "bg-primary-500"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 px-6 pl-10" onClick={() => signOut()}>
        <div className="flex cursor-pointer gap-4">
          <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
          <p className="text-light-2 max-lg:hidden">Logout</p>
        </div>
      </div>
    </section>
  );
};

export default LeftSidebar;
