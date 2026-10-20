"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Header from "@/components/shared/header";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { getLinkById } from "@/data/data";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import Image from "next/image";
import { addDays } from "date-fns";
import { Loader2 } from "lucide-react";
import {
  TOTAL_LINK_STATS_FREE,
  TOTAL_LINK_STATS_STANDARD,
  TOTAL_LINK_STATS_PRO,
} from "@/constants/constants";
import useAuthUser from "@/hooks/use-auth-user";
import UpgradeModal from "@/components/shared/upgrade-plan-modal";
import { LockKeyhole } from "lucide-react";

const StatsGraph = dynamic(
  () => import("@/components/dashboard/my-links/stats-graph"),
  {
    ssr: false,
  }
);
import DownloadStatsCard from "@/components/dashboard/my-links/download-card";
import Link from "next/link";
const HeatmapComponent = dynamic(
  () => import("@/components/dashboard/my-links/heatmap"),
  {
    ssr: false,
  }
);

const StatsPage: React.FC<{ linkTitle: any; id: any }> = ({
  linkTitle,
  id,
}) => {
  const user = useAuthUser();
  const SUBSCRIPTION = user?.["custom:subscription"];

  const [linkInfo, setLinkInfo] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSessionNumber, setSelectedSessionNumber] = useState<any>(
    linkInfo?.sessions.length > 0 ? "All Sessions" : ""
  );
  const [activeTab, setActiveTab] = useState<string>("timespent");
  const [selectedSession, setSelectedSession] = useState<any[] | any>(
    linkInfo?.sessions
  );
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -365), // One year ago from today
    to: new Date(),
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchLinkData = async () => {
      setLoading(true);
      const linkData = await getLinkById(id);
      if (linkData) {
        setLinkInfo(linkData);
        setSelectedSession(linkData?.sessions);
        if (linkData?.sessions?.length > 0) {
          setSelectedSessionNumber(1);
        }
      }
      setLoading(false);
    };
    fetchLinkData();
  }, [id]);

  useEffect(() => {
    if (linkInfo?.sessions?.length > 0) {
      setSelectedSession(linkInfo?.sessions[0]);
    }
  }, [linkInfo?.sessions]);

  // Determine the session limit based on subscription
  const getSessionLimit = () => {
    switch (SUBSCRIPTION) {
      case "PRO":
        return TOTAL_LINK_STATS_PRO;
      case "STANDARD":
        return TOTAL_LINK_STATS_STANDARD;
      default:
        return TOTAL_LINK_STATS_FREE;
    }
  };

  const handleSelectedSession = (session: string) => {
    if (session === "All Sessions") {
      if (SUBSCRIPTION !== "PRO" && SUBSCRIPTION !== "STANDARD") {
        setShowUpgradeModal(true); // Show upgrade modal if user is not PRO
        return;
      }
      setSelectedSessionNumber("All Sessions");
      setSelectedSession(linkInfo?.sessions.slice(0, getSessionLimit()));
    } else {
      const sessionInfo = linkInfo?.sessions?.find(
        (s: any) => s?.number === parseInt(session)
      );
      if (sessionInfo) {
        const sessionLimit = getSessionLimit();
        if (parseInt(session) > sessionLimit) {
          setShowUpgradeModal(true); // Show upgrade modal if session is out of limit
        } else {
          setSelectedSessionNumber(sessionInfo?.number);
          setSelectedSession(sessionInfo);
        }
      } else {
        setSelectedSessionNumber("");
      }
    }
  };

  const handleDateChange = (date: DateRange) => {
    setDate(date);
    setSelectedSession(
      linkInfo?.sessions
        ?.filter((session: any) => {
          const sessionDate = new Date(session?.updatedAt);
          const startDate = date?.from ?? new Date();
          const endDate = addDays(date?.to ?? startDate, 1);
          return sessionDate >= startDate && sessionDate <= endDate;
        })
        .slice(0, getSessionLimit())
    );
  };

  let downloadData = [];

  if (selectedSession) {
    if (selectedSessionNumber === "All Sessions") {
      downloadData = selectedSession?.flatMap(
        (session: any) => session?.analytics?.download || []
      );
    } else if (!Array.isArray(selectedSession)) {
      downloadData = selectedSession?.analytics?.download || [];
    }
  }

  const graphData = (() => {
    if (Array.isArray(selectedSession) && selectedSession?.length === 0) {
      return {
        duration: 0,
        viewTime: {},
      };
    }

    if (
      selectedSessionNumber === "All Sessions" &&
      Array.isArray(selectedSession)
    ) {
      return selectedSession?.reduce(
        (acc: any, session: any) => {
          acc.duration += session?.duration;

          const viewTimeData: any =
            session?.analytics?.viewTime &&
            JSON.parse(session?.analytics?.viewTime);
          if (viewTimeData) {
            for (const [page, time] of Object.entries(viewTimeData)) {
              if (acc.viewTime[page]) {
                acc.viewTime[page] += time;
              } else {
                acc.viewTime[page] = time;
              }
            }
          }

          return acc;
        },
        {
          duration: 0,
          viewTime: {},
        }
      );
    } else if (
      typeof selectedSession === "object" &&
      !Array.isArray(selectedSession)
    ) {
      return {
        duration: selectedSession?.duration ?? 0,
        viewTime: JSON.parse(selectedSession?.analytics?.viewTime ?? "{}"),
      };
    } else {
      return {
        duration: 0,
        viewTime: {},
      };
    }
  })();

  const calculateAveragePercentageRead = (sessions: any) => {
    if (Array.isArray(sessions)) {
      const validSessions = sessions?.filter(
        (session: any) => session?.analytics
      );

      if (validSessions?.length === 0) return 0;

      const totalPercentageRead = validSessions?.reduce(
        (total: number, session: any) => {
          return total + (session?.analytics?.percentageRead ?? 0);
        },
        0
      );

      return totalPercentageRead / validSessions?.length;
    } else if (sessions?.analytics) {
      return sessions?.analytics?.percentageRead ?? 0;
    } else {
      return 0;
    }
  };

  const averagePercentageRead = calculateAveragePercentageRead(selectedSession);

  const heatmapIds = (() => {
    if (
      selectedSessionNumber === "All Sessions" &&
      Array.isArray(selectedSession)
    ) {
      console.log(
        selectedSession?.flatMap(
          (session: any) => session?.analytics.heatmapId[0]
        )
      );
      return selectedSession?.flatMap(
        (session: any) => session?.analytics?.heatmapId[0] || []
      );
    } else if (typeof selectedSession === "object") {
      return selectedSession?.analytics?.heatmapId;
    } else {
      return [];
    }
  })();
  return (
    <div className="w-full h-full flex flex-col py-2 px-5 sm:px-8">
      <nav className="breadcrumb text-[#667085] font-[500] text-[16px]">
        <Link href="/">Rezlinks</Link> / <a href="/my-links">My Links</a> /{" "}
        <span>{linkTitle}</span> / <span>Stats</span>
      </nav>
      <Header
        title={linkTitle}
        subtitle="See how your link is performing"
        buttonText="Export Statistics"
        buttonIconPath="/assets/download.svg"
      />
      {loading ? (
        <div className="flex w-full justify-center items-center h-[40vh]">
          <Loader2 className="animate-spin text-text-quaternary h-[4rem] w-[4rem]" />
        </div>
      ) : (
        <>
          <div className="w-full flex xsm:flex-row flex-col xsm:items-center xsm:justify-between items-center space-x-3 xsm:space-x-0 pb-8 sm:pb-0 my-2">
            <div className="sm:w-[20%] w-full sm:max-w-[300px]">
              <Select
                value={selectedSessionNumber}
                onValueChange={handleSelectedSession}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${
                      selectedSessionNumber === ""
                        ? "No Session"
                        : "Select a Session"
                    }`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {linkInfo?.sessions?.length > 0 ? (
                    <>
                      {linkInfo?.sessions?.length > 1 && (
                        <SelectItem value="All Sessions" className="">
                          <div className="justify-between min-w-[160px] items-center flex">
                            <span>All Sessions</span>
                            {SUBSCRIPTION !== "PRO" &&
                              SUBSCRIPTION !== "STANDARD" && (
                                <LockKeyhole
                                  size={18}
                                  className="text-gray-500 mr-3"
                                />
                              )}
                          </div>
                        </SelectItem>
                      )}
                      {linkInfo?.sessions
                        ?.slice()
                        ?.sort((a: any, b: any) => a.number - b.number)
                        ?.map((session: any) => {
                          const sessionLimit = getSessionLimit();
                          const isLocked = session?.number > sessionLimit;
                          return (
                            <SelectItem
                              key={session?.id}
                              value={session?.number}
                              className=""
                            >
                              <div className="justify-between min-w-[160px] items-center flex">
                                <span>Session {session?.number}</span>
                                {isLocked &&
                                  SUBSCRIPTION !== "PRO" &&
                                  SUBSCRIPTION !== "STANDARD" && (
                                    <LockKeyhole
                                      size={18}
                                      className="text-gray-500 mr-3"
                                    />
                                  )}
                              </div>
                            </SelectItem>
                          );
                        })}
                    </>
                  ) : (
                    <></>
                  )}
                </SelectContent>
              </Select>
            </div>
            <DatePickerWithRange date={date} setDate={handleDateChange} />
          </div>

          <div className="tabs">
            <div className="tabs-list flex justify-center border-[#EAECF0]">
              <button
                className={`tab-trigger flex space-x-2 px-4 rounded-t-[3px] py-2 ${
                  activeTab === "timespent"
                    ? "bg-white text-[#344054] border-t-4 border-primary"
                    : "bg-transparent text-gray-600"
                }`}
                onClick={() => setActiveTab("timespent")}
              >
                <Image
                  src={
                    activeTab === "timespent"
                      ? "/assets/mylinks/time-active.svg"
                      : "/assets/mylinks/time-inactive.svg"
                  }
                  alt="Time Spent"
                  height={24}
                  width={24}
                />
                <span className="icon  text-[16px] font-[500]">Time Spent</span>
              </button>
              <button
                className={`tab-trigger flex space-x-2 rounded-t-[3px] px-4 py-2 ${
                  activeTab === "downloads"
                    ? "bg-white text-[#344054] border-t-4 border-primary"
                    : "bg-transparent text-gray-600"
                }`}
                onClick={() => setActiveTab("downloads")}
              >
                <Image
                  src={
                    activeTab === "downloads"
                      ? "/assets/mylinks/download-active.svg"
                      : "/assets/mylinks/download-inactive.svg"
                  }
                  alt="Downloads"
                  height={24}
                  width={24}
                />
                <span className="icon flex text-[16px] font-[500]">
                  Downloads
                </span>{" "}
              </button>
              <button
                className={`tab-trigger flex space-x-2 rounded-t-[3px] px-4 py-2 ${
                  activeTab === "heatmap"
                    ? "bg-white text-[#344054] border-t-4 border-primary"
                    : "bg-transparent text-gray-600"
                }`}
                onClick={() => setActiveTab("heatmap")}
              >
                <Image
                  src={
                    activeTab === "heatmap"
                      ? "/assets/mylinks/heatmap-active.svg"
                      : "/assets/mylinks/heatmap-inactive.svg"
                  }
                  alt="Heatmap"
                  height={24}
                  width={24}
                />
                <span className="icon flex  text-[16px] font-[500]">
                  Heatmap
                </span>
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "timespent" && (
                <div className="">
                  {graphData ? (
                    <StatsGraph graphData={graphData} />
                  ) : (
                    <>No Session exist to show data</>
                  )}
                </div>
              )}
              {activeTab === "downloads" && (
                <div className="tab-content">
                  <DownloadStatsCard downloadData={downloadData} />
                </div>
              )}
              {activeTab === "heatmap" && (
                <div className="tab-content">
                  {selectedSession ? (
                    <HeatmapComponent
                      url={linkInfo?.url}
                      percentageRead={averagePercentageRead}
                      // sessionAnalytics={selectedSession?.analytics}
                      heatmapIds={heatmapIds}
                      linkId={id}
                    />
                  ) : (
                    <>No Session exist to show data</>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
};

export default StatsPage;
