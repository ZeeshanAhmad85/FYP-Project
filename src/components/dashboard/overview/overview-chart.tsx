"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { OverviewSelect } from "./overview-select";
import { useState } from "react";

import React, { useEffect } from "react";
import { fetchLinksByUserId } from "@/data/data";
import { toast } from "sonner";
import { millisecondsToSeconds } from "@/lib/utils";
import Image from "next/image";
import EmptyState from "@/components/shared/empty-state";

const chartConfig = {
  value: {
    color: "url(#gradient)",
    label: "Time (sec)",
  },
} satisfies ChartConfig;

const useIsMobileScreen = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check to set the state on the client side
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    // Cleanup event listener
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return isMobile;
};

function HorizontainChart({ user }: { user: any }) {
  const [duration, setDuration] = useState("3-months");
  const isMobile = useIsMobileScreen();

  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  const [links, setLinks] = useState<any[]>([]);

  //    RESUMES
  const fetchLinksIfUserExists = async () => {
    if (user) {
      try {
        setIsLoadingLinks(true);
        const fetchedLinks = await fetchLinksByUserId(user.userId);

        setLinks(fetchedLinks);
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setIsLoadingLinks(false);
      }
    }
  };

  useEffect(() => {
    fetchLinksIfUserExists();
  }, [user]);

  const filterLinksByDuration = (links: any[], duration: any) => {
    const now = new Date();
    let startDate;

    switch (duration) {
      case "1-week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "1-month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "3-months":
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
    }

    return links.filter((link) => new Date(link.createdAt) >= startDate);
  };

  const getTopPerformingLinks = (links: any[], duration: any) => {
    // Step 1: Filter links based on the given duration
    const filteredLinks = filterLinksByDuration(links, duration);

    // Step 2: Calculate total session duration for each link
    const linksWithTotalDuration = filteredLinks.map((link) => {
      const totalDuration = link.sessions.reduce((acc: any, session: any) => {
        return acc + session.duration;
      }, 0);

      return { ...link, totalDuration };
    });

    // Step 3: Sort links by total duration in descending order
    linksWithTotalDuration.sort((a, b) => b.totalDuration - a.totalDuration);

    // Step 4: Return the top 5 links
    return linksWithTotalDuration.slice(0, 5);
  };

  const topLinks = getTopPerformingLinks(links, duration);

  const chartData = topLinks.map((link: any) => ({
    company: link.title,
    value: millisecondsToSeconds(link.totalDuration || 0, 0),
  }));

  const allValuesAreZero = chartData.every((data: any) => data.value === "0");

  return (
    <Card className="border-[#EAECF0] rounded-[6px] pr-[8px] py-[16px] xs:p-[24px]">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 mb-2">
        <div className="flex flex-col gap-1 ">
          <h3 className="text-text-primary-foreground text-[18px] sm:text-[24px] font-bold">
            Top Performing links
          </h3>
          <span className="font-normal text-[#667085] text-[12px] sm:text-sm">
            Showing top performing links from last 3 companys
          </span>
        </div>
        <div className="flex justify-end w-full my-2 ">
          <OverviewSelect value={duration} setValue={setDuration} />
        </div>
      </div>
      {/*  LINEAR GRADIENT */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#2584F2", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#9ECBFA", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
      </svg>

      {isLoadingLinks ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      ) : topLinks.length === 0 || allValuesAreZero ? (
        <EmptyState />
      ) : (
        <CardContent className="p-0 sm:p-1">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: isMobile ? 0 : 20,
              }}
            >
              <XAxis
                type="number"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="x-axis-label"
              />
              {isMobile ? (
                <YAxis
                  dataKey="company"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  className="y-axis-label"
                  tickFormatter={(value) => value.slice(0, 3)}
                />
              ) : (
                <YAxis
                  dataKey="company"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="y-axis-label"
                />
              )}
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={5}
                height={10}
                barSize={25}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}

export default HorizontainChart;
