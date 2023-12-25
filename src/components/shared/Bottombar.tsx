"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const Bottombar = () => {
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
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive = pathname.split("/")[1] === link.route.split("/")[1];
          return (
            <div
              onClick={() => handleNavigate(link.route)}
              key={link.label}
              className={`bottombar_link cursor-pointer hover:bg-primary-500 duration-300 ${
                isActive && "bg-primary-500"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 text-subtle-medium max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
