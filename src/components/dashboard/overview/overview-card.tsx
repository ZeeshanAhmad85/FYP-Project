import Image from "next/image";
import React from "react";

const OverviewCard = ({
  title,
  value,
  image,
  isLoading,
}: {
  title: string;
  value: any;
  image: string;
  isLoading: boolean;
}) => {
  return (
    <div className="py-[24px] px-[16px] border-[1px] border-solid bg-white border-[#EAECF0] rounded-[6px] flex flex-col gap-[10px]">
      <div className="flex gap-1">
        <Image src={image} alt="resume" width={24} height={24} />
        <span className="text-text-primary-foreground font-normal text-base">
          {title}
        </span>
      </div>
      {isLoading ? (
        <div className="h-8 rounded-[8px] w-[100px] bg-gray-200 dark:bg-gray-700  mb-4" />
      ) : (
        <span className="text-text-primary-foreground text-[24px] md:text-[32px] font-bold ">
          {value}
        </span>
      )}
    </div>
  );
};

export default OverviewCard;
