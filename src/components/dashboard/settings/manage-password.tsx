import PasswordInput from "@/components/authentication/password-input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";
import SettingsCard from "./settings-card";

import Image from "next/image";
import AlertModal from "@/components/shared/alert-modal";
import { handleUpdatePassword } from "@/lib/cognitoActions";

const ManagePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = () => {
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  const changePasswordHandler = () => {
    //   Checks will be added when fnctionality will be added

    if (!currentPassword) {
      return toast.error("Please enter your current password");
    }
    if (!newPassword) {
      return toast.error("Please enter your new password");
    }
    if (!confirmNewPassword) {
      return toast.error("Please confirm your new password");
    }
    if (newPassword !== confirmNewPassword) {
      return toast.error("Password do not match with Confirm Password");
    }

    openModalHandler();
  };

  const confirmChangePasswordHandler = async () => {
    try {
      const updated = await handleUpdatePassword(undefined, {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      if (updated === "success") {
        toast.success("Password changed successfully");
        setConfirmNewPassword("");
        setCurrentPassword("");
        setNewPassword("");
        closeModalHandler();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while changing your password");
    }
  };

  return (
    <SettingsCard>
      <h2 className="text-text-primary font-bold text-2xl">Manage Password</h2>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex flex-col space-y-2 items-start w-full">
          <label className="text-sm font-bold text-text-primary-foreground text-start">
            Current Password
          </label>
          {/*    CUTSOM COMPONENT */}
          <PasswordInput
            onChange={(value) => setCurrentPassword(value)}
            value={currentPassword}
            placeholder="***************"
            className="w-full"
            isLogin={true}
          />
        </div>
        <div className="flex flex-col space-y-2 items-start w-full">
          <label className="text-sm font-bold text-text-primary-foreground text-start">
            New Password
          </label>
          {/*    CUTSOM COMPONENT */}
          <PasswordInput
            onChange={(value) => setNewPassword(value)}
            value={newPassword}
            placeholder="Enter New Password"
            className="w-full"
          />
        </div>
        <div className="flex flex-col space-y-2 items-start w-full">
          <label className="text-sm font-bold text-text-primary-foreground text-start">
            Confirm New Password
          </label>
          {/*    CUTSOM COMPONENT */}
          <PasswordInput
            onChange={(value) => setConfirmNewPassword(value)}
            value={confirmNewPassword}
            placeholder="Confirm New Password"
            className="w-full"
          />
        </div>
        {/*  Buttons */}
        <div className="w-full flex flex-col-reverse sm:flex-row gap-3 sm:gap-2 mt-4 justify-end">
          <Button
            variant="outline"
            className="px-[28px] py-[16px] sm:h-[56px] sm:w-[111px] font-bold"
          >
            Cancel
          </Button>

          <Button
            className="px-[28px] py-[16px] btn-shadow sm:h-[56px] sm:w-[197px] font-bold "
            onClick={changePasswordHandler}
          >
            Change Password
          </Button>
          {/*   MODAL */}
          <AlertModal isOpen={isModalOpen} onClose={closeModalHandler}>
            <div className="flex flex-col items-center sm:items-start  sm:flex-row gap-4">
              <div className="relative w-[48px] h-[48px] ">
                <Image
                  src={"/assets/dashboard/change-password.svg"}
                  fill
                  alt="Change Password"
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h4 className="text-[18px] font-bold text-text-primary">
                    Change my password?
                  </h4>
                  <p className="text-[14px] font-normal text-text-quaternary">
                    Are you sure you want to change your password? This action
                    cannot be undone.
                  </p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-4 items-center">
                  <Button
                    variant={"outline"}
                    className="grow text-[16px] font-medium text-text-primary w-full"
                    onClick={closeModalHandler}
                  >
                    Close
                  </Button>

                  <Button
                    className="grow text-[16px] font-medium text-white w-full"
                    onClick={confirmChangePasswordHandler}
                  >
                    Yes Change it
                  </Button>
                </div>
              </div>
            </div>
          </AlertModal>
        </div>
      </div>
    </SettingsCard>
  );
};

export default ManagePassword;
