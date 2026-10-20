import { convertDateToResumeModified } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const OverviewHeatmapCard = ({
  thumbnail = "/assets/dashboard/heatmap-card.png",
  title = "UI UX Design Resume",
  createdAt,
}: {
  thumbnail: any;
  title: any;
  createdAt: any;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/my-links");
  };

  return (
    <div className="flex flex-col space-y-2">
      <div
        className="relative h-[100px] col-span-1 w-full cursor-pointer"
        onClick={handleClick}
      >
        <Image
          src={thumbnail || "/assets/dashboard/heatmap-card.png"}
          fill
          objectFit="cover"
          objectPosition="top"
          alt="heatmap"
        />
      </div>
      <div className="flex flex-col">
        <h4 className="text-sm text-text-primary font-medium">{title}</h4>
        <span className="text-text-placeholder text-sm">
          {convertDateToResumeModified(createdAt)}
        </span>
      </div>
    </div>
  );
};

export default OverviewHeatmapCard;
