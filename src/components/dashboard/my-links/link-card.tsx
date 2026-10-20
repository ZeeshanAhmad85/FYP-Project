import Image from "next/image";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { convertDateToResumeModified, formatTime } from "@/lib/utils";
import { deleteLink, updateLink } from "@/data/data";

interface LinkCardProps {
  resumeTitle: string;
  linkData: any;
  id: number;
  onUpdated: any;
  onDeleted: any;
}

const LinkCard: React.FC<LinkCardProps> = ({
  linkData,
  resumeTitle,
  id,
  onUpdated,
  onDeleted,
}) => {
  const shortenLink = (link: string, maxLength: number) => {
    if (link.length <= maxLength) {
      return link;
    }
    return `${link.substring(0, maxLength)}...`;
  };

  const handleUpdateActive = async () => {
    try {
      const updatedLink = await updateLink({
        id: linkData.id,
        active: !linkData.active,
      });
      onUpdated();
      return toast.success("Active status updated successfully!");
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error("Failed to update active status. Please try again.", {
        description: `${error}`,
      });
    }
  };

  let totalDuration = 0;
  let totalDownloads = 0;

  linkData.sessions?.forEach((session: any) => {
    totalDuration += session?.duration || 0;
    if (session.analytics?.download) {
      totalDownloads += session.analytics.download.length;
    }
  });

  let totalSessions = linkData.sessions?.length || 0;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_BASE_URL}${linkData.url}`
      );
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link. Please try again.");
      console.error("Error copying to clipboard:", error);
    }
  };

  const deleteHandler = async () => {
    try {
      await deleteLink(linkData.id);
      onDeleted();
      toast.success("Link deleted successfully!");
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link. Please try again", {
        description: `${error}`,
      });
    }
  };

  return (
    <div className="flex flex-col bg-[#FFFFFF] p-4 border border-[#EAECF0] rounded-[8px]">
      <div className="flex xmd:flex-row flex-col">
        <div className="relative xmd:w-[200px] w-full h-[220px] rounded-[8px] overflow-hidden">
          <Image
            src={linkData?.thumbnail || "/assets/mylinks/heatmap.svg"}
            alt="Heatmap"
            fill
            objectFit="cover"
          />
        </div>
        <div className="flex-1 flex flex-col space-y-2 xmd:px-4 px-0 mt-3 xmd:mt-0">
          <h1 className="text-[18px] font-[700] text-[#344054]">
            {linkData?.title}
          </h1>
          <div className="flex space-x-2 mt-[5px] text-[14px] text-[#667085]">
            <p>{resumeTitle}</p>
            <p>{convertDateToResumeModified(linkData?.createdAt)}</p>
          </div>
          <div className="flex space-y-3 mt-4 flex-col mb-4 text-[14px] text-[#667085]">
            <div className="flex justify-between">
              <h1>Downloads</h1>
              <p className="text-[#344054]">{totalDownloads}</p>
            </div>
            <div className="flex justify-between">
              <h1>Visit Duration</h1>
              <p className="text-[#344054]"> {formatTime(totalDuration)}</p>
            </div>
            <div className="flex justify-between">
              <h1>Total Visits</h1>
              <p className="text-[#344054]">{totalSessions}</p>
            </div>
          </div>
          <div className="flex py-3 items-center space-x-2">
            <label
              className={`block text-[14px] ${
                !linkData.active
                  ? "font-[700] text-[#d0d5dd]"
                  : "font-[400] text-text-primary"
              }`}
            >
              Inactive
            </label>
            <Switch
              checked={linkData.active}
              onCheckedChange={handleUpdateActive}
              className={`${
                linkData.active ? "bg-primary" : "bg-white"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  linkData.active ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <label
              className={`block text-[14px] ${
                !linkData.active
                  ? "font-[400] text-text-primary"
                  : "font-[700] text-primary"
              }`}
            >
              Active
            </label>
          </div>
        </div>
      </div>
      <div className="flex items-center my-4 justify-between">
        <div className="flex items-center">
          <div className="text-[#98A2B3] font-[500] text-[14px]">
            <Link
              href={linkData.url}
              target="_blank"
              rel="noopener noreferrer"
              passHref
            >
              {shortenLink(
                `${process.env.NEXT_PUBLIC_BASE_URL}${linkData.url}`,
                30
              )}
            </Link>
          </div>
          <div>
            <Button
              className="bg-transparent hover:bg-transparent"
              onClick={handleCopyLink}
            >
              <Image src="/assets/copy-2.svg" alt="" height={24} width={24} />
            </Button>
          </div>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image
                src="/assets/mylinks/dots.svg"
                alt=""
                height={24}
                width={24}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={deleteHandler}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <Button
          className="px-4 font-[500] hover:bg-[#E6ECF8] text-[14px] items-center flex space-x-2 py-5 bg-[#E6ECF8] rounded-[8px] text-[#214783]"
          asChild
        >
          <Link href={`/my-links/${id}`} passHref>
            <Image
              src="/assets/mylinks/stats.svg"
              alt=""
              height={24}
              width={24}
            />
            <span>Show Stats</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
