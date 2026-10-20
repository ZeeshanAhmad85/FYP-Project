"use client";
import PlanCard from "@/components/dashboard/my-plans/plan-card";
import { Switch } from "@/components/ui/switch";
import useAuthUser from "@/hooks/use-auth-user";
import React, { useState } from "react";

const Page = () => {
  const [isMonthly, setIsMonthly] = useState(false);

  const PLANS = [
    {
      planName: "Free",
      monthly: "FREE",
      yearly: "FREE",
      showBlueBg: false,
      Icon: "/assets/dashboard/free.svg",
      features: [
        "3 Resumes",
        "5 links per resume",
        "3 sessions' stats per link",
      ],
    },
    {
      planName: "Standard",
      monthly: "$7/month",
      yearly: "$67/year",
      showBlueBg: true,
      Icon: "/assets/dashboard/standard.svg",
      features: [
        "5 Resumes",
        "15 links per resume",
        "5 sessions' stats per link",
        "Detailed & Aggregated Stats",
      ],
    }, // 20% discount applied
    {
      planName: "Pro",
      monthly: "$12/month",
      yearly: "$115/year",
      showBlueBg: false,
      Icon: "/assets/dashboard/pro.svg",
      features: [
        "10 Resumes",
        "30 links per resume",
        "10 sessions' stats per link",
        "Detailed & Aggregated Stats",
        "Custom URL for link",
      ],
    }, // 20% discount applied
    {
      planName: "AI Credits",
      monthly: "$5",
      yearly: "$5",

      showBlueBg: true,
      Icon: "/assets/dashboard/standard.svg",
      features: ["Buy 50 credits", "Generate AI resume content"],
    },
  ];

  return (
    <section className="px-5 sm:px-8 pb-4">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-text-primary-foreground font-[700] text-[32px]">
            Simple, transparent pricing
          </h1>
          <p className="text-text-quaternary text-[16px]">
            {"Upgrade your plan to access more PRO features"}
          </p>
        </div>
        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <span className="text-[16px] font-medium text-text-quaternary">
            Monthly
          </span>
          <Switch checked={isMonthly} onCheckedChange={setIsMonthly} />
          <span className="text-[16px] font-medium text-text-primary">
            Yearly (save 20%)
          </span>
        </div>
        {/* Pricing Plans */}
        <div className="flex md:justify-center mt-4">
          {" "}
          <div className="flex flex-col md:grid w-full md:w-auto md:grid-cols-2 items-center  xlg:grid-cols-3 gap-8 mt-4 justify-items-center	 justify-center">
            {PLANS.map((plan, index) => (
              <PlanCard
                key={index}
                planName={plan.planName}
                price={!isMonthly ? plan.monthly : plan.yearly}
                features={plan.features}
                showBlueBg={plan.showBlueBg}
                Icon={plan.Icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
