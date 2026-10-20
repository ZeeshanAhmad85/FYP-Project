/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Header from "@/components/shared/header";
import StatCard from "@/components/shared/stats-card";
import UpgradeBanner from "@/components/shared/upgrade-banner";
import ResumeCard from "@/components/shared/resume-card";
import Pagination from "@/components/shared/pagination";
import { Input } from "@/components/ui/input-simple";
import UploadResumeModal from "@/components/dashboard/my-resumes/upload-resume-modal";
import EditResumeModal from "@/components/dashboard/my-resumes/edit-resume-modal";
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
import NotFoundSearch from "@/components/dashboard/my-resumes/not-found-search";
import StatusDot from "@/components/dashboard/my-resumes/status-dot";

import PublicLinksModal from "@/components/dashboard/my-resumes/resume-links-modal";
import {
  fetchAverageViewTime,
  fetchLinkCount,
  fetchResumeCount,
  fetchResumesByUserId,
} from "@/data/data";
import { toast } from "sonner";
import useAuthUser from "@/hooks/use-auth-user";
import {
  TOTAL_RESUME_CARD_PER_PAGE,
  TOTAL_RESUME_SUBSCRIPTION_FREE,
  TOTAL_RESUME_SUBSCRIPTION_STANDARD,
} from "@/constants/constants";
import LoadingCard from "@/components/shared/loading-card";
import PreviewResumeModal from "@/components/dashboard/my-resumes/preview-resume";
import CreateLinkModal from "@/components/dashboard/my-links/create-link-modal";
import Modal from "@/components/shared/modal";
import { millisecondsToSeconds } from "@/lib/utils";
import UpgradeModal from "@/components/shared/upgrade-plan-modal";
import { downloadData } from "aws-amplify/storage";
import HeatmapPreview from "@/components/dashboard/my-resumes/preview-heatmap";
import BuiltResumeCard from "@/components/shared/built-resume-card";
import { useRouter } from "next/navigation";
//    IN CONTANTS FILE
const itemsPerPage = TOTAL_RESUME_CARD_PER_PAGE;

const Page = () => {
  const user = useAuthUser();
  const SUBSCRIPTION = user?.["custom:subscription"];
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [status, setStatus] = useState<string>("All");

  const router = useRouter();
  const [resumeType, setResumeType] = useState<string>("Built");

  //   RESUMES
  const [resumes, setResumes] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [editResumeId, setEditResumeId] = useState<any | null>(null);

  const [links, setLinks] = useState<any[]>([]);
  const [resumeTitle, setResumeTitle] = useState<string>("");

  const [refetchThumbnailUrl, setRefetchThumbnailUrl] =
    useState<boolean>(false);

  const [previewResumeUrl, setPreviewResumeUrl] = useState<string | null>(null);

  const [previewHeatmap, setPreviewHeatmap] = useState<any>();

  const [previewHeatmapHandler, setPreviewHeatmapHandler] =
    useState<boolean>(false);

  const [previewModalHandler, setPreviewModalHandler] =
    useState<boolean>(false);

  const [totalResumes, setTotalResumes] = useState<number>(0);
  const [totalLinks, setTotalLinks] = useState<number>(0);
  const [avgViewTime, setAvgViewTime] = useState<number>(0);

  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [createdResumeData, setCreatedResumeData] = useState<any | null>(null);

  const [publishedLinkModal, setPublishedLinkModal] = useState(false);

  const [publicLink, setPublicLink] = useState<string>("");

  //  DATE
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -365), // One year ago from today
    to: new Date(), // Today's date
  });

  //  SHOW UPGRADE MODAL
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const openModal = () => {
    if (
      SUBSCRIPTION === "FREE" &&
      totalResumes >= TOTAL_RESUME_SUBSCRIPTION_FREE
    ) {
      setShowUpgradeModal(true);
      return;
    }
    if (
      SUBSCRIPTION === "STANDARD" &&
      totalResumes >= TOTAL_RESUME_SUBSCRIPTION_STANDARD
    ) {
      setShowUpgradeModal(true);
      return;
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };
  const closeEditModal = async () => {
    setIsEditModalOpen(false);
  };

  const openLinkModal = (links: any, title: string) => {
    setIsLinkModalOpen(true);
    setLinks(links);
    setResumeTitle(title);
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
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

  const fetchResumesIfUserExists = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const fetchedResumes = await fetchResumesByUserId(user?.userId);

        const resumesWithThumbnails = await Promise.all(
          fetchedResumes.map(async (resume: any) => {
            const linksWithThumbnails = await Promise.all(
              resume.links.map(async (link: any) => {
                if (link.sessions && link.sessions.length > 0) {
                  for (const session of link.sessions) {
                    const thumbnail = await fetchThumbnails(link?.id);
                    if (thumbnail) {
                      return { ...link, thumbnail };
                    }
                  }
                }
                return link;
              })
            );

            const thumbnail = linksWithThumbnails.find(
              (link) => link.thumbnail
            )?.thumbnail;

            return { ...resume, thumbnail };
          })
        );

        setResumes(resumesWithThumbnails);
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

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

  useEffect(() => {
    fetchResumesIfUserExists();
    fetchStats();
  }, [user]); // Dependency array includes only `user`

  console.log("resumes", resumes);

  const filteredResumes = resumes
    .filter((resume) =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((resume) => {
      if (status === "All") return true;
      if (status === "Active") return resume.active;
      if (status === "Inactive") return !resume.active;
    })
    .filter((resume) => {
      if (resumeType === "Uploaded") {
        return resume.path && resume.path.trim() !== "";
      } else if (resumeType === "Built") {
        return resume.isBuilt === true;
      }
    })
    .filter((resume) => {
      // Check if updatedAt falls within the date range
      const resumeDate = new Date(resume.updatedAt);
      const startDate = date?.from ?? new Date(); // Default to current date if no from date
      const endDate = addDays(date?.to ?? startDate, 1); // Default to one day after startDate if no to date

      return resumeDate >= startDate && resumeDate <= endDate;
    });

  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1); // Reset to first page on status change
  };

  const handleResumeTypeChange = (value: string) => {
    setResumeType(value);
    setCurrentPage(1); // Reset to first page on resume type change
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResumes.slice(indexOfFirstItem, indexOfLastItem);

  //   HANDLE SAVE AND CREATE LINK
  const handleSaveAndCreateLink = async (resume: any) => {
    setCreatedResumeData(resume);
    setIsModalOpen(false);
    await fetchResumesIfUserExists();

    // setIsLinkModalOpen(true);
    setIsCreateLinkModalOpen(true);
  };

  const handleCloseAndSave = async () => {
    setIsModalOpen(false);
    await fetchResumesIfUserExists();
    await fetchStats();
  };

  const handleEditModal = (id: number) => {
    setEditResumeId(id);
    openEditModal();
  };

  const handleRefetch = async () => {
    await fetchResumesIfUserExists();
    await fetchStats();
    setRefetchThumbnailUrl(!refetchThumbnailUrl);

    setIsEditModalOpen(false);
  };

  const previewClickHandler = (url: string) => {
    setPreviewResumeUrl(url);
    setPreviewModalHandler(true);
  };

  const previewHeatmapModal = (heatmap: any) => {
    console.log(heatmap);
    setPreviewHeatmapHandler(true);
    setPreviewHeatmap(heatmap);
  };

  const ResumeStats = [
    {
      title: "Total Resumes",
      stats: totalResumes,
      icon: "/assets/resume-icon.svg",
    },
    {
      title: "Total Links",
      stats: totalLinks,
      icon: "/assets/total-links.svg",
    },
    {
      title: "Average View Time (seconds)",
      stats: millisecondsToSeconds(avgViewTime),
      icon: "/assets/avg-time.svg",
    },
  ];

  const closeCreateLinkModal = async (publicLink: any) => {
    setPublicLink(publicLink);
    setIsCreateLinkModalOpen(false);
    await fetchResumesIfUserExists();
    await fetchStats();
    setPublishedLinkModal(true);
  };

  const handleBuiltResumeButton = () => {
    if (
      SUBSCRIPTION === "FREE" &&
      totalResumes >= TOTAL_RESUME_SUBSCRIPTION_FREE
    ) {
      setShowUpgradeModal(true);
      return;
    }
    if (
      SUBSCRIPTION === "STANDARD" &&
      totalResumes >= TOTAL_RESUME_SUBSCRIPTION_STANDARD
    ) {
      setShowUpgradeModal(true);
      return;
    }
    router.push("/build-resume/choose-template");
  };

  return (
    <div className="w-full h-full flex flex-col py-2 px-5 sm:px-8">
      {SUBSCRIPTION !== "PRO" && <UpgradeBanner />}
      <Header
        title="My Resumes"
        subtitle="See how resumes are performing and manage them"
        buttonText="Upload Resume"
        buttonIconPath="/assets/upload-2.svg"
        showDevelop={true}
        onButtonClick={openModal}
        onBuiltResumeButtonClick={handleBuiltResumeButton}
      >
        <div className="flex flex-col sm:flex-row sm:flex-wrap  md:items-center sm:space-y-0 sm:space-x-3 py-3">
          {ResumeStats.map((stats, index) => (
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
          All Resumes
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-3 py-3 ">
        <div className="relative items-center flex w-full sm:max-w-[400px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Image src="/assets/search.svg" alt="" height={24} width={24} />
          </span>
          <Input
            type="text"
            placeholder="Search by Resume name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white w-full sm:max-w-[400px] pl-11"
          />
        </div>
        <div className="flex xsm:flex-row w-full flex-col space-y-4 xsm:space-y-0 xsm:space-x-2 sm:w-[60%] sm:max-w-[400px] ">
          <Select value={resumeType} onValueChange={handleResumeTypeChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="Uploaded or Built Resume" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Uploaded">
                <div className="flex pl-2 space-x-3">
                  <span>Uploaded Resumes</span>
                </div>
              </SelectItem>
              <SelectItem value="Built">
                <div className="flex pl-2 space-x-3">
                  <span>Built Resumes</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex xsm:flex-row w-full flex-col space-y-4 xsm:space-y-0 xsm:space-x-2 sm:w-[60%] sm:max-w-[400px] ">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="Stats" />
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
                &quot; {filteredResumes.length} &quot;
              </span>{" "}
              <span className="text-text-quaternary">
                results for your search.
              </span>
            </p>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="grid justify-items-center gap-6 w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xll:grid-cols-[repeat(auto-fit,_minmax(300px,_2fr))] py-6 3xll:justify-self-center ">
          {new Array(3).fill(0).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      )}
      {!isLoading && filteredResumes.length === 0 ? (
        <div className="py-10 w-full h-[20rem] flex justify-center items-center">
          <NotFoundSearch />
        </div>
      ) : (
        !isLoading &&
        filteredResumes.length > 0 && (
          <div className="w-full flex flex-col  items-left">
            <div className="grid justify-items-center	justify-center gap-6 w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 items-center max-w-[1920px]">
              {currentItems?.map((resume) => (
                <React.Fragment key={resume.id}>
                  {resumeType === "Uploaded" ? (
                    <ResumeCard
                      id={resume.id}
                      title={resume.title}
                      lastModified={resume.updatedAt}
                      links={resume.links}
                      isActive={resume.active}
                      thumbnailPath={resume?.path}
                      onEditClick={handleEditModal}
                      onLinkClick={openLinkModal}
                      refetchThumbnail={refetchThumbnailUrl}
                      onPreviewClick={previewClickHandler}
                      heatmap={resume?.thumbnail}
                      onPreviewHeatmap={previewHeatmapModal}
                    />
                  ) : (
                    <BuiltResumeCard
                      id={resume.id}
                      title={resume.title}
                      lastModified={resume.updatedAt}
                      isActive={resume.active}
                      templateType={resume.templateType}
                      thumbnailPath={resume?.templateType}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-center pt-6 items-center h-full w-full">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )
      )}

      {isModalOpen && (
        <UploadResumeModal
          onClose={closeModal}
          onSave={handleCloseAndSave}
          onSaveAndCreateLink={handleSaveAndCreateLink}
        />
      )}
      {isEditModalOpen && (
        <EditResumeModal
          onClose={closeEditModal}
          resumeId={editResumeId}
          onSave={handleRefetch}
        />
      )}
      {isLinkModalOpen && (
        <PublicLinksModal
          onClose={closeLinkModal}
          title={resumeTitle}
          links={links}
        />
      )}
      {previewModalHandler && (
        <PreviewResumeModal
          onClose={() => setPreviewModalHandler(false)}
          resumeUrl={previewResumeUrl}
        />
      )}
      {previewHeatmapHandler && (
        <HeatmapPreview
          onClose={() => setPreviewHeatmapHandler(false)}
          imageUrl={previewHeatmap}
        />
      )}
      {isCreateLinkModalOpen && (
        <CreateLinkModal
          linkData={createdResumeData}
          onClose={closeCreateLinkModal}
        />
      )}
      {publishedLinkModal && (
        <Modal
          icon={"/assets/tick.svg"}
          heading="Your link is ready to be shared."
          subHead="Copy the link below, share it with your recruiter, and start tracking your resume's progress."
          onClose={() => setPublishedLinkModal(false)}
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
