import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlanProgress } from "../shared/plan-progress";
import Image from "next/image";
import useAuthUser from "@/hooks/use-auth-user";
import { useEffect, useState } from "react";
import { fetchLinkCount, fetchResumeCount } from "@/data/data";
import { toast } from "sonner";
import {
  TOTAL_LINK_SUBSCRIPTION_FREE,
  TOTAL_LINK_SUBSCRIPTION_PRO,
  TOTAL_LINK_SUBSCRIPTION_STANDARD,
  TOTAL_RESUME_SUBSCRIPTION_FREE,
  TOTAL_RESUME_SUBSCRIPTION_PRO,
  TOTAL_RESUME_SUBSCRIPTION_STANDARD,
} from "@/constants/constants";
import { Link } from "react-transition-progress/next";

export default function PlanAccordian() {
  const user = useAuthUser();
  const [totalResumes, setTotalResumes] = useState(
    TOTAL_RESUME_SUBSCRIPTION_FREE
  );
  const [totalLinks, setTotalLinks] = useState(TOTAL_LINK_SUBSCRIPTION_FREE);

  const [resumeCountCreated, setResumeCountCreated] = useState(0);
  const [linkCountCreated, setLinkCountCreated] = useState(0);

  const SUBSCRIPTION = user?.["custom:subscription"];

  const fetchResumesIfUserExists = async () => {
    if (user) {
      try {
        const [resumeCount, linkCount] = await Promise.all([
          fetchResumeCount(user?.userId),
          fetchLinkCount(user?.userId),
        ]);
        setResumeCountCreated(resumeCount);
        setLinkCountCreated(linkCount);
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };

  useEffect(() => {
    if (SUBSCRIPTION === "STANDARD") {
      setTotalResumes(TOTAL_RESUME_SUBSCRIPTION_STANDARD);
      setTotalLinks(TOTAL_LINK_SUBSCRIPTION_STANDARD);
    } else if (SUBSCRIPTION === "PRO") {
      setTotalResumes(TOTAL_RESUME_SUBSCRIPTION_PRO);
      setTotalLinks(TOTAL_LINK_SUBSCRIPTION_PRO);
    }
  }, [SUBSCRIPTION]);

  useEffect(() => {
    fetchResumesIfUserExists();
  }, [user]);

  return (
    <Accordion type="single" collapsible className="w-full mb-4">
      <AccordionItem
        value="item-1"
        className="border-[1px] border-solid border-[#1F3E6D] rounded-[8px] px-3  py-2"
      >
        <AccordionTrigger className="text-white font-medium text-[18px] ">
          {SUBSCRIPTION === "PRO"
            ? "Pro"
            : SUBSCRIPTION === "STANDARD"
            ? "Standard"
            : "Free"}{" "}
          Plan
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col">
            <span className="text-[12px] text-text-placeholder font-normal">
              You are currently on{" "}
              {SUBSCRIPTION === "PRO"
                ? "Pro"
                : SUBSCRIPTION === "STANDARD"
                ? "Standard"
                : "Free"}{" "}
              plan with following incentives.
            </span>
            {/*  Resume Progress */}
            <div className="flex flex-col mt-2 gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[12px] text-text-placeholder font-normal">
                    Resumes
                  </span>
                  <span className="text-[12px] text-white font-medium">
                    {resumeCountCreated}/{totalResumes} remaining
                  </span>
                </div>
                <PlanProgress
                  value={(resumeCountCreated / totalResumes) * 100}
                  className="bg-[#214783] h-[5px]"
                  indicatorClassName="bg-[#5D90D3]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[12px] text-text-placeholder font-normal">
                    Links
                  </span>
                  <span className="text-[12px] text-white font-medium">
                    {linkCountCreated}/{totalLinks} remaining
                  </span>
                </div>
                <PlanProgress
                  value={(linkCountCreated / totalLinks) * 100}
                  className="bg-[#214783] h-[5px]"
                  indicatorClassName="bg-[#5D90D3]"
                />
              </div>
              {/*  Buttons */}
              <Link
                href="/my-plans"
                className="border-[1px] mt-1 border-solid text-white justify-center border-[#2859A1] flex gap-1 py-1 px-[16px] rounded-[6px]"
              >
                {SUBSCRIPTION !== "PRO" ? "Upgrade now" : "Manage Plans"}{" "}
                <Image
                  src="/assets/dashboard/rocket.svg"
                  alt="rocket"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
