import React from "react";
import SettingsCard from "./settings-card";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/shared/alert-modal";
import Image from "next/image";
import { toast } from "sonner";
import { handleDeleteUser } from "@/lib/cognitoActions";
import { useRouter } from "next/navigation";

const DeleteAccount = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const router = useRouter();

  const modalOpenHandler = () => {
    setIsModalOpen(true);
  };
  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  const confirmDeleteHandler = async () => {
    try {
      await handleDeleteUser();
      toast.success("Account deleted successfully");
      closeModalHandler();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting your account");
    }
  };
  return (
    <SettingsCard>
      <h2 className="text-text-primary font-bold text-2xl">Delete Account</h2>
      <div className="flex flex-col gap-8 mt-8 max-w-[556px]">
        <div className="flex flex-col gap-2">
          <h3 className="text-[20px] text-text-quaternary font-bold">
            We’re sorry to see you go
          </h3>
          <p className="text-text-quaternary text-[18px] font-normal">
            Are you sure you want to delete your account? This action is
            irreversible.
          </p>
        </div>
        <Button
          variant={"destructive"}
          className="text-white font-medium text-base py-[16px] px-[28px] sm:max-w-[200px] h-[52px] mt-2 bg-[#F04438]"
          onClick={modalOpenHandler}
        >
          Delete Account
        </Button>
        <AlertModal isOpen={isModalOpen} onClose={closeModalHandler}>
          <div className="flex flex-col items-center sm:items-start  sm:flex-row gap-4">
            <div className="relative w-[48px] h-[48px] ">
              <Image
                src={"/assets/dashboard/delete-account-alert.svg"}
                fill
                alt="Change Password"
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h4 className="text-[18px] font-bold text-text-primary">
                  Delete my account?
                </h4>
                <p className="text-[14px] font-normal text-text-quaternary">
                  Are you sure you want to delete your account? This action
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
                  className="grow text-[16px] font-medium text-white w-full bg-[#F04438]"
                  onClick={confirmDeleteHandler}
                  variant={"destructive"}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </AlertModal>
      </div>
    </SettingsCard>
  );
};

export default DeleteAccount;
