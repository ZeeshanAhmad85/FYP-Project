import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect } from "react";
import React from "react";
import { formatTime } from "@/lib/utils";

interface StatsGraphProps {
  graphData: {
    duration: number; // Total duration in milliseconds
    viewTime: { [key: number]: number }; // { pageNumber: timeInMilliseconds }
  };
}

const StatsGraph: React.FC<StatsGraphProps> = ({ graphData }) => {
  const { duration, viewTime } = graphData;

  const [isMobile, setIsMobile] = useState(window?.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window?.innerWidth <= 768);
    };

    // Initial check to set the state on the client side
    if (typeof window !== "undefined") {
      handleResize();
      window?.addEventListener("resize", handleResize);
    }

    // Cleanup event listener
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Transform viewTime into chartData
  const chartData = Object?.keys(viewTime).map((pageKey: any) => ({
    page: `Page ${pageKey}`,
    time: viewTime[pageKey] / 1000,
  }));

  const chartConfig = {
    time: {
      label: "Time Spent",
      color: "url(#gradient)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="border-none rounded-[6px] pr-[8px] py-[16px] xs:p-[24px]">
      <CardHeader className="border-b border-b-[#EAECF0] px-4">
        <CardDescription>
          <div className="max-w-[1920px] mx-auto">
            {duration === 0 && Object.keys(viewTime).length === 0 ? (
              <span className="text-[18px] text-[#667085]">
                No analytics for this session.
              </span>
            ) : (
              <span className="text-[18px] text-[#667085]">
                <span className="text-[#344054] font-[700] text-[18px] bg-[#EAECF0] p-2 rounded-[8px] mr-2">
                  {formatTime(duration)}
                </span>
                Total time recruiters spent on your resume
              </span>
            )}
          </div>
        </CardDescription>
      </CardHeader>
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
      <CardContent className="sm:max-h-[550px] max-w-[1920px] mx-auto overflow-hidden px-0 pb-[4rem]">
        <ChartContainer
          className="sm:max-h-[450px] w-full sm:h-full h-[450px] !my-[4rem] px-0"
          config={chartConfig}
        >
          {Object.keys(viewTime).length === 0 ? (
            <div className="flex items-center justify-center  text-[#667085] text-[18px]">
              No page-wise information exists.
            </div>
          ) : (
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="horizontal"
              barSize={10}
              margin={{
                left: isMobile ? 0 : 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="page"
                type="category"
                tickLine={false}
                axisLine={false}
                className="y-axis-label"
              />
              <YAxis
                type="number"
                dataKey="time"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="y-axis-label"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="time"
                fill="var(--color-time)"
                radius={8}
                height={10}
                barSize={60}
              >
                <LabelList
                  dataKey="time"
                  position="top"
                  offset={12}
                  style={{ fill: "#344054" }}
                  className="fill-foreground text-[16px] font-[500]"
                />
              </Bar>
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StatsGraph;
