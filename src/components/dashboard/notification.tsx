"use client";
import React from "react";
import Image from "next/image";
import { NotificationType } from "@/constants/constants";
import { formatTimeAgo } from "@/lib/utils";

interface NotificationsProps {
  show: boolean;
  onAnimationEnd: () => void;
  notifications: any[];
  unreadCount: number; // Added to track unread notifications count
}

const iconPaths: any = {
  [NotificationType.Live]: "/assets/svg/link-ready.svg",
  [NotificationType.View]: "/assets/svg/view.svg",
  [NotificationType.Download]: "/assets/svg/download.svg",
};

const getBackgroundColor = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.Live:
      return "#027A4826";
    case NotificationType.View:
      return "#F0443826";
    case NotificationType.Download:
      return "#EAB30826";
    default:
      return "transparent";
  }
};

const getNotificationType = (message: string): any => {
  if (
    message.includes("Bingo! Your Link") &&
    message.includes("just got a view.")
  ) {
    return NotificationType.View;
  }
  if (
    message.includes("Whoo! Your link") &&
    message.includes("is live and ready to be shared.")
  ) {
    return NotificationType.Live;
  }
  if (
    message.includes("Whoo! Your Resume from link") &&
    message.includes("is just downloaded.")
  ) {
    return NotificationType.Download;
  }
  return null;
};

const Notifications: React.FC<NotificationsProps> = ({
  show,
  onAnimationEnd,
  notifications,
  unreadCount = 0,
}) => {
  // Filter notifications to include only those from the last week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentNotifications = notifications.filter(
    (notification) => new Date(notification.createdAt) >= oneWeekAgo
  );

  // Sort notifications by createdAt in descending order
  const sortedNotifications = recentNotifications
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div
      className={`absolute z-50 max-h-[500px] overflow-y-scroll right-0 mt-2 w-96 bg-white border border-[#EAECF0] rounded-[8px] py-4 px-6 ${
        show ? "notifications" : "notifications-leave"
      }`}
      style={{
        boxShadow: "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex justify-between items-center pb-4 border-b border-[#EAECF0]">
        <h2 className="text-[18px] text-[#667085] font-[700]">Notifications</h2>
        <div className="flex items-center space-x-6">
          <div className="py-[4px] px-3 rounded-[8px] bg-[#E6ECF8]">
            <span className="text-[12px] font-[500] text-primary">
              {unreadCount || 0} New
            </span>
          </div>
          <div>
            <Image
              src="/assets/notification.svg"
              width={24}
              height={24}
              alt="notifications"
              priority={true}
            />
          </div>
        </div>
      </div>
      {sortedNotifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-start py-3 last:mb-0 last:border-none border-b border-[#EAECF0]"
        >
          <div
            className="mr-4 min-w-[40px] h-[40px] flex items-center justify-center rounded-[4px]"
            style={{ backgroundColor: getBackgroundColor(notification.type) }}
          >
            <Image
              src={iconPaths[notification.type]}
              alt="icon"
              width={24}
              height={24}
              priority={true}
            />
          </div>
          <div>
            <p className="text-[12px] font-[500]">{notification.message}</p>
            <p className="text-[12px] font-[400] text-[#98A2B3]">
              {formatTimeAgo(notification.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
