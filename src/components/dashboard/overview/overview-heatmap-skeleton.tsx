import React from "react";

const OverviewHeatMapSkeleton = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="relative h-[100px] col-span-1 w-full ">
        <div className="animate-pulse bg-gray-300 h-full w-full rounded-[8px]"></div>
      </div>
      <div className="flex flex-col">
        <div className="animate-pulse bg-gray-300 h-4 w-3/4 mb-2 rounded-[8px]"></div>
        <div className="animate-pulse bg-gray-300 h-3 w-1/2 rounded-[8px]"></div>
      </div>
    </div>
  );
};

export default OverviewHeatMapSkeleton;
