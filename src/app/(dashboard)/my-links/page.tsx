"use client";

import Header from "@/components/shared/header";
import StatCard from "@/components/shared/stats-card";
import UpgradeBanner from "@/components/shared/upgrade-banner";
import Pagination from "@/components/shared/pagination";
import { Input } from "@/components/ui/input-simple";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import NotFoundSearch from "@/components/dashboard/my-links/not-found-links";
import StatusDot from "@/components/dashboard/my-resumes/status-dot";
import LinkRow from "@/components/dashboard/my-links/link-row";
import LinkCard from "@/components/dashboard/my-links/link-card";
import CreateLinkModal from "@/components/dashboard/my-links/create-link-modal";
import { toast } from "sonner";
import {
  fetchActiveLinksCount,
  fetchAverageViewTime,
  fetchLinkCount,
  fetchLinksByUserId,
  fetchResumeCount,
} from "@/data/data";
import useAuthUser from "@/hooks/use-auth-user";
import CreateSeparateLinkModal from "@/components/dashboard/my-links/create-separate-link-model";
import Modal from "@/components/shared/modal";
import {
  TOTAL_LINK_CARD_PER_PAGE,
  TOTAL_LINK_SUBSCRIPTION_FREE,
  TOTAL_LINK_SUBSCRIPTION_STANDARD,
} from "@/constants/constants";
import LinkRowSkeleton from "@/components/dashboard/my-links/link-row-skeleton";
import LoadingCard from "@/components/shared/loading-card";
import { millisecondsToSeconds } from "@/lib/utils";
import UpgradeModal from "@/components/shared/upgrade-plan-modal";
import Confetti from "react-dom-confetti";
import EmptyState from "@/components/shared/empty-state";
import { downloadData } from "aws-amplify/storage";
const Page = () => {
  const [status, setStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //   LINKS
  const [links, setLinks] = useState<any>([]);

  const [isLoadingLinks, setIsLoadingLinks] = useState<boolean>(true);

  //   SELECTED RESUME
  const [selectedResume, setSelectedResume] = useState<string>("All");

  //  DATE RANGE
  //  DATE
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -365), // One year ago from today
    to: new Date(),
  });

  const user = useAuthUser();

  //   After Publishing the url then show Modal
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [publicLink, setPublicLink] = useState<string>("");

  //  LINKS STATS
  const [activeLinks, setActiveLinks] = useState<number>(0);
  const [totalLinks, setTotalLinks] = useState<number>(0);
  const [avgVisitTime, setAvgVisitTime] = useState<number>(0);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  //   SUBSCRIPTION
  const SUBSCRIPTION = user?.["custom:subscription"];
  // const [showConfetti, setShowConfetti] = useState<boolean>(false);
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

  const fetchLinksIfUserExists = async () => {
    if (user) {
      try {
        setIsLoadingLinks(true);
        const fetchedLinks = await fetchLinksByUserId(user.userId);
        const linksWithThumbnails = await Promise.all(
          fetchedLinks.map(async (link: any) => {
            const thumbnail = await fetchThumbnails(link?.id);
            return { ...link, thumbnail: thumbnail };
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

  const fetchStats = async () => {
    if (user) {
      try {
        setIsLoadingStats(true);
        const [linkCount, activeLinkCount, averageViewTime] = await Promise.all(
          [
            fetchLinkCount(user?.userId),
            fetchActiveLinksCount(user?.userId),
            fetchAverageViewTime(user?.userId),
          ]
        );

        setTotalLinks(linkCount);
        setActiveLinks(activeLinkCount);
        setAvgVisitTime(averageViewTime);
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setIsLoadingStats(false);
      }
    }
  };

  const itemsPerPage = TOTAL_LINK_CARD_PER_PAGE;

  const filteredLinks = links
    .filter((link: any) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((link: any) => {
      if (status === "All") return true;
      if (status === "Active") return link.active;
      if (status === "Inactive") return !link.active;
    })
    .filter((link: any) => {
      if (selectedResume === "All") return true;
      return link.resume?.title === selectedResume;
    })
    .filter((resume: any) => {
      // Check if updatedAt falls within the date range
      const resumeDate = new Date(resume.updatedAt);
      const startDate = date?.from ?? new Date(); // Default to current date if no from date
      const endDate = addDays(date?.to ?? startDate, 1); // Default to one day after startDate if no to date

      return resumeDate >= startDate && resumeDate <= endDate;
    });

  const linksToShow = filteredLinks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectedResume = (resume: string) => {
    setSelectedResume(resume);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateButtonClick = () => {
    if (SUBSCRIPTION === "FREE" && totalLinks >= TOTAL_LINK_SUBSCRIPTION_FREE) {
      setShowUpgradeModal(true);
      return;
    }
    if (
      SUBSCRIPTION === "STANDARD" &&
      totalLinks >= TOTAL_LINK_SUBSCRIPTION_STANDARD
    ) {
      setShowUpgradeModal(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = async (publicLink: string) => {
    setIsModalOpen(false);
    await fetchLinksIfUserExists();
    await fetchStats();
    setIsPublished(true);

    setPublicLink(publicLink);
  };

  useEffect(() => {
    fetchLinksIfUserExists();
    fetchStats();
  }, [user]); // Dependency array includes only

  //  DATA VARIABLE

  const LinksStats = [
    {
      title: "Total Links",
      stats: totalLinks,
      icon: "/assets/mylinks/totalLinks.svg",
    },
    {
      title: "Active Links",
      stats: activeLinks,
      icon: "/assets/mylinks/activeLinks.svg",
    },
    {
      title: "Average Visit Time (seconds)",
      stats: millisecondsToSeconds(avgVisitTime),
      icon: "/assets/mylinks/avgVisit.svg",
    },
  ];

  const updateLinksHandler = async () => {
    await fetchLinksIfUserExists();
    await fetchStats();
  };

  const deleteLinkHandler = async () => {
    await fetchLinksIfUserExists();
    await fetchStats();
  };

  return (
    <div className="w-full h-full flex flex-col py-2 px-5 sm:px-8">
      {SUBSCRIPTION !== "PRO" && <UpgradeBanner />}
      <Header
        title="My Links"
        subtitle="See how different links are performing."
        buttonText="Create a Link"
        buttonIconPath="/assets/mylinks/plus.svg"
        onButtonClick={handleCreateButtonClick}
      >
        <div className="flex flex-col sm:flex-row sm:flex-wrap  md:items-center sm:space-y-0 sm:space-x-3 py-3">
          {LinksStats.map((stats, index) => (
            <div key={index} className="flex-1 sm:max-w-[500px]">
              <StatCard
                title={stats.title}
                value={stats.stats}
                iconPath={stats.icon}
                isLoading={isLoadingStats}
              />
            </div>
          ))}
        </div>
      </Header>
      <div className="py-4">
        <h1 className="text-text-primary-foreground font-bold text-2xl">
          All Links
        </h1>
      </div>
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-3 py-3 ">
        <div className="flex xsm:flex-row flex-col xsm:space-x-3 w-full">
          <div className="relative items-center flex w-full sm:max-w-[400px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Image src="/assets/search.svg" alt="" height={24} width={24} />
            </span>
            <Input
              type="text"
              placeholder="Search a link by title"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-white w-full sm:max-w-[400px] pl-11"
            />
          </div>
          <div className="md:w-[30%] w-full">
            <Select value={selectedResume} onValueChange={handleSelectedResume}>
              <SelectTrigger>
                <SelectValue placeholder="Resume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">
                  <span>All</span>
                </SelectItem>

                {[
                  ...new Set(
                    links
                      .filter((link: any) => link?.resume)
                      .map((link: any) => link?.resume?.title)
                  ),
                ].map((resumeTitle: any, index: number) => {
                  return (
                    <SelectItem key={index} value={resumeTitle}>
                      <span>{resumeTitle}</span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex xsm:flex-row w-full flex-col space-y-4 xsm:space-y-0 xsm:space-x-2 md:w-[60%] md:max-w-[400px] ">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">
                <div className="flex pl-2 space-x-3">
                  <StatusDot isActive={false} isAll={true} isDropdown={true} />
                  <span>All</span>
                </div>
              </SelectItem>
              <SelectItem value="Active">
                <div className="flex pl-2 space-x-3">
                  <StatusDot isActive={true} isAll={false} isDropdown={true} />
                  <span>Active</span>
                </div>
              </SelectItem>
              <SelectItem value="Inactive">
                <div className="flex pl-2 space-x-3">
                  <StatusDot isActive={false} isAll={false} isDropdown={true} />
                  <span>Inactive</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>

      <div className="">
        {searchTerm && (
          <div className="py-2">
            <h2 className="text-[24px] font-[400] text-text-primary-foreground">
              <span>Keyword Search:</span>{" "}
              <span className="font-[700]">&quot; {searchTerm} &quot;</span>
            </h2>
            <p className="text-[14px] font-[400]">
              <span className="text-text-quaternary">We found </span>
              <span className="text-[16px] font-[700] text-text-primary-foreground">
                &quot; {linksToShow?.length} &quot;
              </span>{" "}
              <span className="text-text-quaternary">
                results for your search.
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col space-y-6 py-4">
        {isLoadingLinks &&
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="flex-1">
              <div className="hidden md:block">
                <LinkRowSkeleton />
              </div>
              <div className="block md:hidden">
                <LoadingCard />
              </div>
            </div>
          ))}
        {!isLoadingLinks && linksToShow?.length > 0 ? (
          <>
            {linksToShow
              ?.filter((link: any) => link?.resume)
              .map((stats: any, index: any) => {
                return (
                  <React.Fragment key={index}>
                    <div key={index} className="flex-1">
                      <div className="hidden md:block">
                        <LinkRow
                          linkData={stats}
                          resumeTitle={stats?.resume?.title}
                          id={stats.id}
                          onUpdated={updateLinksHandler}
                          onDeleted={deleteLinkHandler}
                          index={index}
                        />
                      </div>
                      <div className="block md:hidden">
                        <LinkCard
                          linkData={stats}
                          resumeTitle={stats.resume?.title}
                          id={stats.id}
                          onUpdated={updateLinksHandler}
                          onDeleted={deleteLinkHandler}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            <div className="flex justify-center pt-6 items-center h-full w-full">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="pb-[4rem] pt-[2rem]">
            <EmptyState
              text="No links available"
              img="/assets/not-found-search.svg"
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateSeparateLinkModal
          onClose={handleCloseModal}
          onCrossClose={() => setIsModalOpen(false)}
        />
      )}
      {isPublished && (
        <Modal
          icon={"/assets/tick.svg"}
          heading="Your link is ready to be shared."
          subHead="Copy the link below, share it with your recruiter, and start tracking your resume's progress."
          onClose={() => {
            setIsPublished(false);
            // setShowConfetti(false);
          }}
          isOnboarding={true}
          publicLink={publicLink}
        />
      )}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
};

export default Page;
