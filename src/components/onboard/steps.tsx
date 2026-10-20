"use client";

import { cn } from "@/lib/utils";
// import { useOnboardContext } from "@/context/onboard-context";
import Image from "next/image";
import { usePathname } from "next/navigation";

const STEPS = [
  {
    name: "1. Basic Details",
    icons: [
      "/assets/onboard/1-filled.svg",
      "/assets/onboard/1-outline.svg",
      "/assets/onboard/1-gray.svg",
    ],
    url: "/onboarding/basic-details",
  },
  {
    name: "2. Resume Information",
    icons: [
      "/assets/onboard/2-filled.svg",
      "/assets/onboard/2-outline.svg",
      "/assets/onboard/2-gray.svg",
    ],
    url: "/onboarding/upload-resume",
  },
  {
    name: "3. Create a link",
    icons: [
      "/assets/onboard/3-filled.svg",
      "/assets/onboard/3-outline.svg",
      "/assets/onboard/3-gray.svg",
    ],
    url: "/onboarding/create-link",
  },
];

const Steps = () => {
  const pathname = usePathname();
  // const { step } = useOnboardContext();

  // Determine if a step is completed or the current step based on the current pathname
  const isStepCompleted = (stepUrl: any) => {
    const stepIndex = STEPS.findIndex((step) => step.url === stepUrl);
    const currentStepIndex = STEPS.findIndex((step) =>
      pathname.endsWith(step.url)
    );
    return stepIndex <= currentStepIndex;
  };

  return (
    <ol className="w-full px-8 pb-[1.8rem] sm:py-[1.8rem] !bg-white sm:flex sm:space-x-[24px] sm:space-y-0 space-y-6 lg:border-t lg:border lg:border-[#EAECF0]">
      {STEPS.map((stepInfo, i) => {
        const isCurrent = pathname.endsWith(stepInfo.url);
        const isCompleted = isStepCompleted(stepInfo.url);
        const iconIndex = isCurrent ? 0 : isCompleted ? 1 : 2; // Determine icon index

        return (
          <li
            key={stepInfo.name}
            className="relative pt-4 sm:pt-0 overflow-hidden sm:flex-1"
          >
            <div className="flex flex-col space-y-2 sm:space-y-0">
              <Image
                src={stepInfo.icons[iconIndex]}
                alt={`Step ${i + 1} icon`}
                width={32}
                height={32}
                className="ml-4 sm:ml-0"
              />
              <span>
                <span className="flex items-center h-full text-sm font-medium">
                  <span
                    className={cn(
                      "absolute left-0 rounded-[8px] top-0 h-full w-1 sm:mt-9 bottom-0 sm:h-[8px] sm:w-full",
                      {
                        "bg-[#EAECF0]": !isCurrent && !isCompleted,
                        "bg-primary": isCurrent,
                        "bg-[#E6ECF8]": isCompleted && !isCurrent,
                      }
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex h-full min-w-0 sm:mt-5 pl-4 sm:pl-0 flex-col justify-center items-center">
                    <span
                      className={cn("text-sm font-semibold", {
                        "text-primary": isCompleted || isCurrent,
                        "text-text-quaternary": !isCurrent && !isCompleted,
                      })}
                    >
                      {stepInfo.name}
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Steps;
