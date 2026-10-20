"use client";
import React from "react";
import { PanelRight } from "lucide-react";
import Image from "next/image";
import NavLinks from "./nav-links";
import LogoutForm from "./logout-form";
import { CircleX } from "lucide-react";
import Notifications from "./notification";

interface MobileNavProps {
  bellButtonHandler: () => void;
  hasNewNotifications: boolean;
  notificationsViewed: boolean;
  notificationCount: number;
  notificationVisible: boolean;
  imageSrc: string | null;
  notifications: any[];
  showNotifications: boolean;
  handleAnimationEnd: any;
}

const MobileNav: React.FC<MobileNavProps> = ({
  bellButtonHandler,
  hasNewNotifications,
  notificationsViewed,
  notificationCount,
  notificationVisible,
  imageSrc,
  notifications,
  showNotifications,
  handleAnimationEnd,
}) => {
  const [showNav, setShowNav] = React.useState(false);
  // console.log(bellButtonHandler, "bellButtonHandler");

  const showNavHandler = () => {
    setShowNav(!showNav);
  };

  return (
    <div className="lg:hidden block">
      <div className="flex  items-center py-[16px] px-3 justify-between">
        <div className="flex gap-5 items-center pl-3">
          <PanelRight size={24} onClick={showNavHandler} color="#344054" />
          <div className="relative w-[135px] h-[43px] ">
            <Image src="/assets/logo-new.svg" alt="Logo" fill />
          </div>
        </div>
        <div className="flex items-center gap-4 pr-4">
          <div className="relative cursor-pointer" onClick={bellButtonHandler}>
            <div
              className={`relative ${
                hasNewNotifications && !notificationsViewed ? "bell-ring" : ""
              }`}
            >
              <Image
                src="/assets/bell.svg"
                alt="bell"
                width={24}
                height={24}
                priority={true}
              />
              <span
                className={`absolute top-[-15px] right-[-8px] bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-full badge-transition ${
                  notificationCount > 0 ? "badge-show" : "badge-hide"
                }`}
              >
                {notificationCount}
              </span>
            </div>
            {notificationVisible && (
              <div className="absolute z-60 top-full left-[5rem] xsm:left-none xsm:right-0 mt-2">
                {/* Assuming Notifications component is imported */}
                <Notifications
                  show={showNotifications}
                  onAnimationEnd={handleAnimationEnd}
                  notifications={notifications}
                  unreadCount={notificationCount}
                />
              </div>
            )}
          </div>

          <div className="relative w-[32px] h-[32px] ">
            <Image
              src={imageSrc || "/assets/default-profile-pic.svg"}
              alt="Profile"
              fill
              className="w-full h-full overflow-hidden object-cover object-center rounded-full absolute"
            />
          </div>
        </div>
      </div>
      <div
        className={`fixed z-[100] top-0 left-0 lg:hidden bg-primary-dashboard w-[300px] h-screen py-4 overflow-hidden transition-transform transform ${
          showNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between gap-6 h-full relative">
          <span onClick={showNavHandler} className="absolute top-0 right-3">
            <CircleX size={24} color="white" />
          </span>
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
          {/* LOGOUT BOTTOM */}
          <LogoutForm />
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
