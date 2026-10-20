"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import Image from "next/image";
import ToolTip from "./tooltip";

const RadialGraph: React.FC<{ percent: number }> = ({
  percent,
}: {
  percent: number;
}) => {
  const chartData = [{ percentRead: percent, fill: "url(#gradient)" }];

  const chartConfig = {
    percentRead: {
      label: "Percentage Read",
    },
    safari: {
      label: "Safari",
      color: "url(#gradient)",
    },
  } satisfies ChartConfig;

  const endAngle = percent * 3.6;

  const formatPercent = (value: number) => {
    return value % 1 === 0
      ? value.toLocaleString()
      : value.toFixed(1).toLocaleString();
  };

  return (
    <Card
      className="flex border border-[#EAECF0] flex-col bg-none"
      style={{
        boxShadow: "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
      }}
    >
      <CardHeader className="items-center pb-0"></CardHeader>
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
      <CardContent className="flex-1  p-0">
        <div className="flex px-8 justify-between items-center">
          <p className="text-[18px] font-[700] text-[#344054] text-left">
            Read Percentage
          </p>
          <ToolTip title="This represents how many pages recruiter has read">
            <Image
              src="/assets/svg/mark-1.svg"
              className="pr-[-4] cursor-pointer"
              height={24}
              width={24}
              alt=""
            />
          </ToolTip>
        </div>

        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-white"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="percentRead" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {formatPercent(chartData[0].percentRead) + "%"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Resume read
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RadialGraph;
