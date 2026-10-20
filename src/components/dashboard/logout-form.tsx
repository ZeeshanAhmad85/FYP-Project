"use client";

import { handleSignOut } from "@/lib/cognitoActions";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "react-transition-progress/next";
import { cn } from "@/lib/utils";
import Setting from "../../../public/assets/svg/setting";
import Image from "next/image";
import SettingActive from "../../../public/assets/svg/setting-active";
import PlanAccordian from "./plan-accordian";

export default function LogoutForm() {
  const link = {
    name: "Settings",
    href: "/settings",
    logo: Setting,
    active: SettingActive,
  };
  const pathname = usePathname();
  const router = useRouter();

  const signoutHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await handleSignOut();
      router.push("/login");
      return toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };
  return (
    <div className="flex flex-col gap-1 px-2 w-full">
      <PlanAccordian />
      <Link
        href={link.href}
        className={cn(
          "text-[#FCFCFD] px-[16px] py-[12px] flex gap-[6px] items-center",
          {
            "text-white  border-[2px] border-primary border-solid rounded-[8px] bg-[#1F355B]":
              pathname === link.href,
          }
        )}
      >
        {pathname === link.href ? (
          <link.active />
        ) : (
          <link.logo color={pathname === link.href ? "#FFFFFF" : "#FCFCFD"} />
        )}
        <span
          className={cn("text-base font-medium  text-[#FCFCFD]", {
            "text-white": pathname === link.href,
          })}
        >
          {link.name}
        </span>
      </Link>

      <form
        className={cn(
          "text-[#FCFCFD] px-[16px] py-[12px] flex gap-[6px] items-center"
        )}
        onSubmit={signoutHandler}
      >
        <Image src="/assets/logout.svg" alt="logout" width={32} height={32} />
        <button className={cn("text-base font-medium  text-[#FCFCFD]")}>
          Sign out
        </button>
      </form>
    </div>
  );
}
