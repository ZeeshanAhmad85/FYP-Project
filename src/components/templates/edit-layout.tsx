"use client";
import { ArrowLeft } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { handleUpdateOnboarding } from "@/lib/cognitoActions";
import { useRouter } from "next/navigation";
import useAuthUser from "@/hooks/use-auth-user";

const EditLayout = ({
  showBackButton = true,
  localCredits = 0,
}: {
  showBackButton?: boolean;
  localCredits?: number;
}) => {
  const router = useRouter();
  const user = useAuthUser();

  console.log("user  1", user);
  console.log("CREDITS", localCredits);

  return (
    <>
      <nav className="flex items-center justify-between px-2  sm:px-4 py-4">
        <span className="hidden md:opacity-0 md:block">Rezlinks</span>
        <div className="flex gap-2">
          <Image
            src="/assets/logo-new.svg"
            alt="Logo"
            width={135}
            height={40}
          />
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-primary text-base font-medium">
            {localCredits} credits left
          </span>
          <Image
            src={
              user?.picture ||
              "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
            }
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </nav>
      {showBackButton && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full  max-w-screen-xl mx-auto">
          <Link
            href="/onboarding/choose-template"
            className="flex items-center gap-2 uppercase"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Templates</span>
          </Link>
          <button
            onClick={async () => {
              await handleUpdateOnboarding();
              router?.push("/overview");
            }}
            className="flex items-center gap-2 uppercase"
          >
            <span>Skip</span>
          </button>
        </div>
      )}
    </>
  );
};

export default EditLayout;
