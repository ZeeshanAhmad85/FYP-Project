"use client";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  convertDateToResumeModified,
  formatTime,
  shortenLink,
} from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-transition-progress/next";
import { deleteLink, updateLink } from "@/data/data";
import { GalleryThumbnails } from "lucide-react";

interface LinkData {
  title: string;
  created: string;
  isActive: boolean;
  downloads: number;
  visitDuration: number;
  avgVisits: number;
  link: string;
  thumbnail: any;
}

interface LinkRowProps {
  resumeTitle: string;
  linkData: any;
  id: number;
  onUpdated: any;
  onDeleted: any;
  index: number;
  // thumbnail: any;
}

const LinkRow: React.FC<LinkRowProps> = ({
  linkData,
  resumeTitle,
  id,
  onUpdated,
  onDeleted,
  index,
}) => {
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
      toast.error("Failed to update active status. Please try again.");
    }
  };

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

  let totalDuration = 0;
  let totalDownloads = 0;

  linkData.sessions?.forEach((session: any) => {
    totalDuration += session?.duration || 0;
    if (session.analytics?.download) {
      totalDownloads += session.analytics.download.length;
    }
  });

  let totalSessions = linkData.sessions?.length || 0;

  return (
    <div className="flex bg-[#FFFFFF] min-h-[166px] p-2 border border-[#EAECF0] rounded-[8px]">
      <div className="relative w-[140px] xml:h-[150px]  h-[180px] mr-4 rounded-[8px] overflow-hidden">
        <Image
          src={linkData.thumbnail || "/assets/mylinks/heatmap.svg"}
          alt="Heatmap"
          layout="fill"
          objectFit="cover"
          objectPosition="top"
        />
      </div>
      <div className="flex-1 px-3 py-2 flex flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h1 className="text-[18px] font-[700] text-[#344054]">
              {typeof linkData?.title === "string" && linkData?.title}
            </h1>
            <div className="flex space-x-3 mt-[5px]">
              <p className="text-[14px] text-[#667085]">{resumeTitle}</p>
              <p className="text-[14px] text-[#667085]">
                {convertDateToResumeModified(linkData?.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <label
                className={`block text-[14px] ${
                  !linkData?.active
                    ? "font-[700]  text-[#d0d5dd]"
                    : "font-[400] text-text-primary"
                }`}
              >
                Inactive
              </label>
              <Switch
                checked={linkData?.active}
                onCheckedChange={handleUpdateActive}
                className={`${
                  linkData?.active ? "bg-primary" : "bg-white"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    linkData?.active ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              <label
                className={`block text-[14px] ${
                  !linkData?.active
                    ? "font-[400] text-text-primary"
                    : "font-[700] text-primary"
                }`}
              >
                Active
              </label>
            </div>

            <Button
              className="px-4 font-[500] hover:bg-[#E6ECF8] text-[14px] items-center flex space-x-2 py-3 bg-[#E6ECF8] rounded-[8px] text-[#214783]"
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

        <div className="flex xml:flex-row sm:mt-5 xml:mt-0 flex-col xml:space-x-4 justify-between w-full">
          <div className="flex space-x-[4rem] text-[14px] text-[#667085]">
            <div>
              <h1 className="">Downloads</h1>
              <p className="text-[24px] text-[#344054]">{totalDownloads}</p>
            </div>
            <div>
              <h1>Visit Duration</h1>
              <p className="text-[24px] text-[#344054]">
                {formatTime(totalDuration)}
              </p>
            </div>
            <div>
              <h1>Total Visits</h1>
              <p className="text-[24px] text-[#344054]">{totalSessions}</p>
            </div>
          </div>

          <div className="flex justify-end items-center">
            <div className="text-[#98A2B3] font-[500] text-[14px]">
              <Link
                href={linkData?.url}
                target="_blank"
                rel="noopener noreferrer"
                passHref
              >
                {shortenLink(
                  `${process.env.NEXT_PUBLIC_BASE_URL}${linkData?.url}`,
                  30
                )}
              </Link>
            </div>
            <div>
              <Button
                className="bg-transparent hover:bg-transparent"
                onClick={handleCopyLink} // Add onClick handler
              >
                <Image src="/assets/copy-2.svg" alt="" height={24} width={24} />
              </Button>
            </div>
            <div className="flex items-center ml-3 mr-[-7px]">
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
                    onClick={deleteHandler}
                    className="cursor-pointer"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkRow;
