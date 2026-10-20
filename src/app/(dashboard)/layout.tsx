"use client";
import React, { useState, useEffect } from "react";
import MobileNav from "@/components/dashboard/mobile-nav";
import SideNav from "@/components/dashboard/side-nav";
import Image from "next/image";
import Notifications from "@/components/dashboard/notification";
import { generateClient } from "aws-amplify/data"; // Verify this import if using AWS Amplify
import type { Schema } from "../../../amplify/data/resource";
import useAuthUser from "@/hooks/use-auth-user";
import { getUrl } from "aws-amplify/storage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

enum NotificationType {
  Live = "live",
  View = "view",
  Download = "download",
}

const getNotificationType = (message: string): NotificationType | undefined => {
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
  return NotificationType.Live;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthUser();
  const userId = user?.userId;

  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsViewed, setNotificationsViewed] = useState(false);
  const [viewedNotificationIds, setViewedNotificationIds] = useState<
    Set<string>
  >(new Set());
  const [newNotifications, setNewNotifications] = useState<Set<string>>(
    new Set()
  );

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const fetchData = async () => {
    if (user?.picture) {
      if (
        user?.picture ===
        "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
      ) {
        setImageSrc(user?.picture);
      } else {
        if (
          user?.identities &&
          !user?.picture.startsWith("profile-pictures/")
        ) {
          const userProfile = user?.picture;
          setImageSrc(userProfile);
        } else {
          const userProfile = await getUrl({
            path: user.picture,
            options: {
              validateObjectExistence: false,
              expiresIn: 900,
              useAccelerateEndpoint: false,
            },
          });

          setImageSrc(userProfile?.url?.href);
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const client = generateClient<Schema>();

      const sub = client.models.Notification.observeQuery({
        filter: { userId: { eq: userId } },
      }).subscribe({
        next: ({ items }: { items: any[] }) => {
          const updatedNotifications = items.map((notification: any) => ({
            ...notification,
            type: getNotificationType(notification.message),
          }));
          setNotifications(updatedNotifications);

          // Determine new notifications
          const unreadNotifications = updatedNotifications.filter(
            (notification) => !notification.isRead
          );
          const unreadNotificationIds = new Set(
            unreadNotifications.map((n: any) => n.id)
          );

          setNewNotifications(unreadNotificationIds);
          setNotificationCount(unreadNotificationIds.size);
          setHasNewNotifications(unreadNotificationIds.size > 0);
        },
      });

      return () => sub.unsubscribe();
    }
  }, [userId, viewedNotificationIds]);

  const handleBellClick = async () => {
    setShowNotifications((prev) => !prev);
    setNotificationVisible(true);
    setHasNewNotifications(false);
    setNotificationsViewed(true);

    // Update notifications in the database to mark them as read
    const client = generateClient<Schema>();
    const batchUpdatePromises = Array.from(newNotifications).map(async (id) => {
      await client.models.Notification.update({
        id,
        isRead: true,
      });
    });
    await Promise.all(batchUpdatePromises);

    setViewedNotificationIds(
      new Set([...viewedNotificationIds, ...newNotifications])
    ); // Mark all new notifications as viewed
    setNewNotifications(new Set()); // Reset new notifications
  };

  const handleAnimationEnd = () => {
    if (!showNotifications) {
      setNotificationVisible(false);
    }
  };

  useEffect(() => {
    setHasNewNotifications(notificationCount > 0);
  }, [notificationCount]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row max-w-[1920px] mx-auto bg-[#F7F7F7]">
      <SideNav />
      <MobileNav
        bellButtonHandler={handleBellClick}
        hasNewNotifications={hasNewNotifications}
        notificationsViewed={notificationsViewed}
        notificationCount={notificationCount}
        notificationVisible={notificationVisible}
        imageSrc={imageSrc}
        notifications={notifications}
        showNotifications={showNotifications}
        handleAnimationEnd={handleAnimationEnd}
      />
      <div className="flex-grow h-full m-0 p-0">
        <div className="relative py-[20px] hidden bg-white border-b border-[#EAECF0] justify-end lg:flex lg:px-[32px] mb-4">
          <div className="flex gap-5 items-center">
            <Link href="/resume-checker">
              <Button className="bg-primary hover:bg-primary/90">
                Check Resume ATS
              </Button>
            </Link>
            <div
              className="relative mt-2 cursor-pointer"
              onClick={handleBellClick}
            >
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
                <div className="absolute z-60 top-full right-0 mt-2">
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
                src={
                  imageSrc ||
                  "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
                }
                alt="Profile"
                fill
                className="w-full h-full overflow-hidden object-cover object-center rounded-full absolute"
              />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
