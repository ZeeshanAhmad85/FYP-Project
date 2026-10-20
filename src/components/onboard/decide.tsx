"use client";

import Steps from "@/components/onboard/steps";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { handleUpdateOnboarding } from "@/lib/cognitoActions";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Decide = () => {
  const router = useRouter();

  const handleBuildResume = () => {
    router.push("/onboarding/choose-template");
  };

  const handleUploadResume = () => {
    router.push("/onboarding/upload-resume?type=upload");
  };

  return (
    <>
      <MaxWidthWrapper className="flex flex-col w-full justify-center items-center pb-[2.3rem] ">
        <div className="w-full flex justify-between">
          <button
            onClick={() => router?.push("/onboarding/basic-details")}
            className="text-[#344054] font-[500] pt-[4rem] flex item-center uppercase"
          >
            <Image src="/assets/svg/back.svg" height={24} width={24} alt="" />{" "}
            <span className="ml-2">back</span>
          </button>
          <button
            onClick={async () => {
              await handleUpdateOnboarding();
              router?.push("/overview");
            }}
            className="text-[#344054] font-[500] pt-[4rem] uppercase"
          >
            skip
          </button>
        </div>
        <div className="w-full h-full flex justify-center">
          <div className="flex flex-col items-center w-full gap-4 ">
            <h1 className="text-foreground font-bold text-2xl my-8">
              Resume Information
            </h1>
            <div className="w-[421px] h-[405px] relative  pt-6">
              <Image
                src={"/assets/onboard/decide.png"}
                alt="Decide"
                fill
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-foreground font-bold text-xl my-4">
                {" "}
                Do you have any existing resume?
              </h2>
              <div className="flex gap-2">
                <Button
                  className="bg-[#E6ECF8] hover:bg-[#E6ECF8]/90 text-primary w-[146px] h-[52px]"
                  onClick={handleBuildResume}
                >
                  No
                </Button>
                <Button
                  className="bg-primary text-white w-[146px] h-[52px]"
                  onClick={handleUploadResume}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Decide;
