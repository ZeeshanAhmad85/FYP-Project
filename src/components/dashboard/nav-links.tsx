"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Link } from "react-transition-progress/next";
import Home from "../../../public/assets/svg/home";
import Resume from "../../../public/assets/svg/resume";
import MyLink from "../../../public/assets/svg/link";
import Dollar from "../../../public/assets/svg/dollar";
import ResumeActive from "../../../public/assets/svg/resume-active";
import LinkActive from "../../../public/assets/svg/link-active";
import HomeActive from "../../../public/assets/svg/home-active";
import Plan from "../../../public/assets/dashboard/plans";
import PlanActive from "../../../public/assets/svg/plan-active";
import Feedback from "../../../public/assets/svg/feedback";
import FeedbackInactive from "../../../public/assets/svg/feedback-inactive";

import { cn } from "@/lib/utils";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: " Overview", href: "/overview", logo: Home, active: HomeActive },
  {
    name: "My Resumes",
    href: "/my-resume",
    logo: Resume,
    active: ResumeActive,
  },
  {
    name: "My Links",
    href: "/my-links",
    logo: MyLink,
    active: LinkActive,
  },

  {
    name: "My Feedbacks",
    href: "/my-feedbacks",
    logo: FeedbackInactive,
    active: Feedback,
  },
  {
    name: "My Plans",
    href: "/my-plans",
    logo: Plan,
    active: PlanActive,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-1 px-2 w-full">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "text-[#FCFCFD] px-[16px] py-[12px] flex gap-[6px] items-center",
              {
                "text-white  border-[2px] border-primary border-solid rounded-[8px] bg-[#1F355B]":
                  isActive,
              }
            )}
          >
            {isActive ? (
              <link.active />
            ) : (
              <link.logo color={isActive ? "#FFFFFF" : "#FCFCFD"} />
            )}
            <span
              className={cn("text-base font-medium  text-[#FCFCFD]", {
                "text-white": isActive,
              })}
            >
              {link.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
