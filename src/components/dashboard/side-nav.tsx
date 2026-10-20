import Image from "next/image";
import React from "react";
import NavLinks from "./nav-links";
import LogoutForm from "./logout-form";

const SideNav = () => {
  return (
    <aside className="sticky left-0 top-0 w-[300px] min-w-[300px] px-2 bg-primary-dashboard py-[20px]   h-full lg:h-screen overflow-y-scroll  hidden lg:block">
      <div className="flex flex-col justify-between gap-6  h-full">
        <div className="flex-col flex gap-[24px]">
          <div className="flex justify-center">
            <Image
              src="/assets/new-logo-dashboard.svg"
              alt="logo"
              width={110}
              height={28}
            />
          </div>

          <NavLinks />
        </div>
        {/*  LOGOUT BOTTOM */}
        <LogoutForm />
      </div>
    </aside>
  );
};

export default SideNav;
