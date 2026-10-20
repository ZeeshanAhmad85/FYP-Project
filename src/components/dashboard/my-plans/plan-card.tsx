import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import CheckFeature from "../../../../public/assets/svg/check-feature";
import { Button } from "@/components/ui/button";

const getPlanLink = (planName: any, price: any) => {
  let planUrl = "#";

  if (planName === "Standard") {
    if (price === "$7/month") {
      //  MY showBlueBg
      planUrl = "https://buy.stripe.com/test_9AQ8Afe2FcXy64w289";
    } else {
      planUrl = "https://buy.stripe.com/test_aEUg2H6AdbTufF6bIK";
    }
  } else if (planName === "Pro") {
    if (price === "$12/month") {
      planUrl = "https://buy.stripe.com/test_6oE8AfbUxcXy1Og8wz";
    } else {
      planUrl = "https://buy.stripe.com/test_9AQ8Afe2FcXy64w289";
    }
  } //  FOR BUYING AI CREDITS  PLAN
  else if (planName === "AI Credits") {
    planUrl = "https://buy.stripe.com/test_28obMr5w9e1CdwYcMR";
  }

  return planUrl;
};

const PlanCard = ({
  price,
  features,
  className,
  showBlueBg = false,
  planName,
  Icon,
  onClickButton,
  index,
}: PlanCardProps) => {
  return (
    <div
      className={cn(
        "rounded-[16px] max-w-full w-full 2sxl:max-w-[350px] 2sxl:w-[335px]  border-[1px]  border-solid border-[#EAECF0] bg-white p-[24px] shadow-plan-card hover:scale-105 cursor-pointer transition-transform duration-300 ease-in-out ",
        {
          "bg-primary text-white relative": showBlueBg,
        },
        className
      )}
    >
      {index === 1 && (
        <div>
          <span className="absolute -top-[35px] -right-3  md:-right-[40px] text-[#5BBAF3]  text-[14px] font-medium">
            Most Popular
          </span>
          <Image
            src="/assets/dashboard/arrow-standard.svg"
            alt="Most Popular"
            width={61}
            height={30}
            className="absolute -top-[15px] md:-top-[25px] right-3 md:right-[40px]"
          />
        </div>
      )}
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-5 grow">
          <Image src={Icon} alt={planName || "Icon"} width={56} height={56} />
          <span
            className={cn("text-[18px] font-medium text-primary", {
              "text-white": showBlueBg,
            })}
          >
            {planName}
          </span>
          {/*  PRICE */}
          <h3
            className={cn("text-[32px] font-bold text-text-primary", {
              "text-white": showBlueBg,
            })}
          >
            {price}
          </h3>
          {/*  features */}
          {
            <div className="flex flex-col gap-2 min-h-[250px] ">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <CheckFeature color={showBlueBg ? "white" : "#356CB5"} />
                  <span
                    className={cn(
                      "text-[16px] font-normal text-text-quaternary",
                      {
                        "text-white": showBlueBg,
                      }
                    )}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          }
        </div>
        {/*  Button */}

        <a
          href={getPlanLink(planName, price)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className={cn(
              "bg-primary rounded-[8px] mt-auto py-[12px] shadow-plan-button text-sm font-bold px-[20px] flex items-center border-[1px] border-solid border-primary",
              {
                "text-primary": showBlueBg,
                "text-white": !showBlueBg,
                "bg-white border-[1px] border-solid border-white hover:bg-white/80 hover:text-primary/80":
                  showBlueBg,
              }
            )}
            //onClick={onClickButton}
          >
            Get Started
          </Button>
        </a>
      </div>
    </div>
  );
};

export default PlanCard;
