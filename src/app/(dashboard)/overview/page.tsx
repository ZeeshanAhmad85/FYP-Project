"use client";
import dynamic from "next/dynamic";

const HorizontainChart = dynamic(
  () => import("@/components/dashboard/overview/overview-chart"),
  {
    ssr: false,
  }
);
import OverviewCard from "@/components/dashboard/overview/overview-card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import OverviewTable from "@/components/dashboard/overview/overview-table";
import OverviewHeatmap from "@/components/dashboard/overview/overview-heatmap";
import { toast } from "sonner";
import { downloadData } from "aws-amplify/storage";
import Confetti from "react-dom-confetti";
import useAuthUser from "@/hooks/use-auth-user";
import {
  fetchAverageViewTime,
  fetchLinkCount,
  fetchLinksByUserId,
  fetchResumeCount,
} from "@/data/data";
import { formatViews, millisecondsToSeconds, shortenLink } from "@/lib/utils";
import EmptyState from "@/components/shared/empty-state";

import "aws-amplify/auth/enable-oauth-listener";

const Page = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  const user = useAuthUser();

  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [totalResumes, setTotalResumes] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const [avgViewTime, setAvgViewTime] = useState(0);

  //   RECENT LINKS
  const [links, setLinks] = useState<any[]>([]);
  const [top6RecentLinks, setTop6RecentLinks] = useState<any[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  const fetchStats = async () => {
    if (user) {
      try {
        setIsLoadingStats(true);
        const [resumeCount, linkCount, averageViewTime] = await Promise.all([
          fetchResumeCount(user?.userId),
          fetchLinkCount(user?.userId),
          fetchAverageViewTime(user?.userId),
        ]);

        setTotalResumes(resumeCount);
        setTotalLinks(linkCount);
        setAvgViewTime(averageViewTime);
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setIsLoadingStats(false);
      }
    }
  };

  const fetchThumbnails = async (linkId: string) => {
    if (user) {
      try {
        console.log(linkId);
        const downloadResult = await downloadData({
          path: `thumbnails/${linkId}.png`,
        }).result;
        console.log(downloadResult);
        if (downloadResult?.body) {
          return URL.createObjectURL(downloadResult?.body as any);
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  };

  const fetchLinks = async () => {
    if (user) {
      try {
        setIsLoadingLinks(true);
        const fetchedLinks = await fetchLinksByUserId(user?.userId);

        // Fetch thumbnails for each link if any of its sessions have a thumbnail
        const linksWithThumbnails = await Promise.all(
          fetchedLinks.map(async (link: any) => {
            // Check if any session of the link has a thumbnail
            let thumbnail = null;
            if (link.sessions && link.sessions.length > 0) {
              for (const session of link.sessions) {
                if (
                  session.analytics?.heatmapId &&
                  session.analytics.heatmapId.length > 0
                ) {
                  thumbnail = await fetchThumbnails(link?.id); // Fetch thumbnail based on link ID
                  if (thumbnail) break; // Stop searching once a thumbnail is found
                }
              }
            }
            return { ...link, thumbnail };
          })
        );

        setLinks(linksWithThumbnails);
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setIsLoadingLinks(false);
      }
    }
  };

  function getTop6RecentLinks(linkData: any) {
    const sortedLinks: any[] = linkData?.sort(
      (a: any, b: any) =>
        (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any)
    );

    // Return the first 5 elements (most recent)
    return sortedLinks?.slice(0, 6);
  }

  useEffect(() => {
    fetchStats();
    fetchLinks();
  }, [user]);

  useEffect(() => {
    setTop6RecentLinks(getTop6RecentLinks(links));
  }, [links]);

  const overview = [
    {
      title: "Total Resumes",
      value: Number(totalResumes),
      image: "/assets/dashboard/resume.svg",
    },
    {
      title: "Total Links",
      value: Number(totalLinks),
      image: "/assets/dashboard/links.svg",
    },
    {
      title: "Average View Time (sec)",
      value: millisecondsToSeconds(avgViewTime),
      image: "/assets/dashboard/time.svg",
    },
  ];

  useEffect(() => {
    const confettiFlag = localStorage.getItem("confetti");
    if (confettiFlag === "true") {
      setShowConfetti(true);
      localStorage.removeItem("confetti"); // Remove the flag after showing confetti
    }
  }, []);

  //  Copied to clipboard
  const copyToClipboard = (text: any) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  const handleClick = (item: any) => {
    copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL}${item?.url}`);
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 400, spread: 90 }}
        />
      </div>
      <section className="px-5 sm:px-8 pb-4">
        <h3 className="text-text-primary-foreground font-medium  text-xl ">
          Welcome Back,{" "}
          <span className="text-primary font-bold">{user?.given_name}!</span>
        </h3>
        <div className="flex flex-col gap-2">
          <h2 className="text-[24px] md:text-[32px] text-text-primary-foreground font-bold">
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-[10px]">
            {overview.map((item, index) => (
              <OverviewCard key={index} {...item} isLoading={isLoadingStats} />
            ))}
          </div>
          {/*  CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-3  gap-3 py-[10px]">
            <div className="md:col-span-2 ">
              <HorizontainChart user={user} />
            </div>
            <div className="col-span-1  p-[16px] sm:p-[24px] border-[1px] border-solid bg-white border-[#EAECF0] rounded-[6px] flex flex-col gap-[10px]">
              <div className="flex flex-col gap-1">
                <h3 className="text-text-primary-foreground font-bold text-[18px] sm:text-[24px]">
                  Recent Links
                </h3>
                <span className="text-text-quaternary font-normal text-[12px] sm:text-sm">
                  See how my recent links are performing
                </span>
              </div>
              {/*  Cards */}
              {isLoadingLinks ? (
                <div className="flex flex-col gap-2">
                  {[1, 1, 1, 1, 1, 1].map((item, i) => (
                    <div
                      className="flex justify-between py-4 px-4 items-center border-b border-gray-200 border-solid group"
                      key={i}
                    >
                      <div className="flex flex-col grow gap-2">
                        <h4 className="h-4 bg-gray-200 rounded animate-pulse text-xs font-medium"></h4>
                        <span className="text-gray-400 text-xs h-3 bg-gray-200 rounded animate-pulse"></span>
                      </div>
                      <span className="flex gap-1">
                        <span className="text-gray-400 text-sm font-normal h-3 bg-gray-200 rounded animate-pulse"></span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : top6RecentLinks.length === 0 ? (
                <EmptyState
                  img="/assets/dashboard/link-empty.svg"
                  text="No links available"
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {top6RecentLinks.map((item, i) => (
                    <div
                      className="flex justify-between py-[8px] px-[4px] items-center border-b-[1px] border-[#EAECF0] border-solid group"
                      key={i}
                    >
                      <div className="flex flex-col grow">
                        <h4 className="text-text-primary-foreground font-medium text-[14px]">
                          {item.title}
                        </h4>
                        <span className="text-text-placeholder text-[12px]">
                          {shortenLink(
                            `${process.env.NEXT_PUBLIC_BASE_URL}${item.url}`,
                            27
                          )}
                        </span>
                      </div>
                      <span className="flex gap-1">
                        <Image
                          src="/assets/dashboard/views.svg"
                          width={24}
                          height={24}
                          alt="views"
                          className="opacity-0 group-hover:opacity-100 cursor-pointer"
                          onClick={() => handleClick(item)}
                        />
                        <span className="text-primary text-sm font-normal">
                          {item.sessions.length} {" views"}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/*   Bottom Table */}
          <div className="grid grid-cols-1 md:grid-cols-3  gap-5">
            <div className="flex flex-col gap-5 md:col-span-2  p-[16px] sm:p-[24px]border-[1px] border-solid bg-white border-[#EAECF0] rounded-[6px] ">
              <div className="flex flex-col gap-1">
                <h3 className="text-text-primary-foreground font-bold text-[18px] sm:text-[24px]">
                  My Resumes
                </h3>
                <span className="text-text-quaternary font-normal text-[12px] sm:text-sm">
                  See how different resumes are performing right now
                </span>
              </div>
              <OverviewTable />
            </div>

            {/*  Heat Map */}
            <div className="flex flex-col gap-5 col-span-1  p-[16px] sm:p-[24px] border-[1px] border-solid bg-white border-[#EAECF0] rounded-[6px] ">
              <div className="flex flex-col gap-1">
                <h3 className="text-text-primary-foreground font-bold text-[18px] sm:text-[24px]">
                  Heatmaps
                </h3>
                <span className="text-text-quaternary font-normal text-[12px] sm:text-sm">
                  See how recent Links are being viewed
                </span>
              </div>
              <OverviewHeatmap
                data={top6RecentLinks}
                isLoading={isLoadingLinks}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
