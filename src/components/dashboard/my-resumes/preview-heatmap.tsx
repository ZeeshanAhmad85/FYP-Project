import * as React from "react";
import Image from "next/image";

interface HeatmapPreviewProps {
  imageUrl: string;
  onClose: any;
}

const HeatmapPreview: React.FC<HeatmapPreviewProps> = ({
  imageUrl,
  onClose,
}) => {
  console.log("imageUrl", imageUrl);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
      <div
        className="bg-[#F7F7F7] z-[99999]  my-6 overflow-hidden max-w-[900px] mx-auto flex flex-col py-4  px-1  sm:py-6 sm:px-8 rounded-[8px]"
        style={{ boxShadow: "0px 4px 6px -2px #10182808" }}
      >
        <div className="flex w-full justify-end">
          <button
            className="bg-[#EAECF0] overflow-hidden flex items-center justify-center rounded-[8px] cursor-pointer py-3 px-3"
            onClick={onClose}
          >
            <Image
              src="/assets/cross.svg"
              alt=""
              width={16}
              height={16}
              priority
            />
          </button>
        </div>

        <div className="h-[80vh] mr-[30px] relative  overflow-auto max-w-full w-[400px] sm:w-[500px] md:w-[700px]">
          <div
            style={{
              alignItems: "center",
              display: "flex",
              height: "4000px",
              justifyContent: "center",
              width: "100%",
              position: "relative",
            }}
          >
            <Image src={imageUrl} alt="Heatmap" fill />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPreview;
