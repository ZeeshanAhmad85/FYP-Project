"use client";

import React from "react";
import Image from "next/image";

interface StatCardProps {
  iconPath: string;
  title: string;
  value: any;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  iconPath,
  title,
  value,
  isLoading,
}) => {
  return (
    <div className="flex flex-col w-full sm:w-auto min-h-[129px] h-full my-2 sm:my-0 xsm:mx-2 sm:mx-0 px-4 py-6 bg-white rounded-[8px] border border-[#EAECF0]">
      <div className="flex items-center ">
        <Image src={iconPath} alt={title} height={24} width={24} />
        <div className="ml-2">
          <p className="text-text-primary-foreground text-[16px]">{title}</p>
        </div>
      </div>
      {isLoading ? (
        <div className="h-8 rounded-md bg-gray-200 dark:bg-gray-700  mt-4 w-20" />
      ) : (
        <p className="text-[32px] mt-2 font-[700] text-text-primary-foreground">
          {value}
        </p>
      )}
    </div>
  );
};

export default StatCard;
