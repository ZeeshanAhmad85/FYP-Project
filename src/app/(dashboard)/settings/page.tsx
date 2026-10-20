"use client";
import DeleteAccount from "@/components/dashboard/settings/delete-account";
import ManagePassword from "@/components/dashboard/settings/manage-password";
import ProfileSettings from "@/components/dashboard/settings/profile-settings";
import VerticalTabs from "@/components/dashboard/settings/vertical-tabs";
import { useTabs } from "@/context/tab-context";
import React from "react";

const Page = () => {
  const { activeTab } = useTabs();
  return (
    <section className=" px-5 sm:px-8 ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col ">
          <h2 className="text-[24px] md:text-[32px] text-text-primary-foreground font-bold">
            Account Settings
          </h2>
          <span className="text-[16px] sm:text-[18px] font-normal text-text-primary">
            Manage your account settings
          </span>
        </div>

        <div className="grid grid-cols-1 gap-y-4 lg:gap-0 lg:grid-cols-3">
          <VerticalTabs />
          <div className="lg:col-span-2  sm:px-8">
            {activeTab === 1 && <ProfileSettings />}
            {activeTab === 2 && <ManagePassword />}
            {activeTab === 3 && <DeleteAccount />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
