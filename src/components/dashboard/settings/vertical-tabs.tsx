import React from "react";
import { useTabs } from "@/context/tab-context";
import ProfileSettings from "../../../../public/assets/svg/profile-settings";
import ManagePassword from "../../../../public/assets/svg/manage-password";
import DeleteAccount from "../../../../public/assets/svg/delete-account";

const VerticalTabs = () => {
  const { activeTab, setActiveTab } = useTabs();
  const TABS = [
    {
      name: "Profile Settings",
      icon: ProfileSettings,
      step: 1,
    },
    {
      name: "Manage Password",
      icon: ManagePassword,
      step: 2,
    },
    {
      name: "Delete Account",
      icon: DeleteAccount,
      step: 3,
    },
  ];
  return (
    <div className="flex flex-col w-full col-span-1">
      {TABS.map((item) => (
        <div
          key={item.step}
          className={`flex justify-start items-center cursor-pointer py-3 pl-5 border-solid border-l-[3px]   ${
            activeTab === item.step
              ? "bg-[#E6ECF8] text-[#356CB5]  border-[#356CB5] "
              : "bg-[#F7F7F7] text-text-primary border-[#F7F7F7]"
          }`}
          onClick={() => setActiveTab(item.step)}
        >
          {
            <item.icon
              color={activeTab === item.step ? "#356CB5" : "#344054"}
            />
          }
          <span className="ml-2">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default VerticalTabs;
