import React from "react";
import OverviewHeatmapCard from "./overview-heatmap-card";
import OverviewHeatMapSkeleton from "./overview-heatmap-skeleton";
import EmptyState from "@/components/shared/empty-state";

const OverviewHeatmap = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  return (
    <>
      {!isLoading && data.length === 0 ? (
        <div className="flex items-center justify-center w-full ">
          <EmptyState
            text="No data available"
            img="/assets/dashboard/empty-chart.svg"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          {isLoading
            ? [1, 1, 1, 1, 1, 1].map((item, index) => (
                <OverviewHeatMapSkeleton key={index} />
              ))
            : data.map((item: any, index: any) => (
                <OverviewHeatmapCard key={index} {...item} />
              ))}
        </div>
      )}
    </>
  );
};

export default OverviewHeatmap;
