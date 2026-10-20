import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import Image from "next/image";
import React from "react";
import WaterMarkPreview from "./water-mark-resume-preview";

const renderPage = (props: any) => (
  <>
    {props.canvasLayer.children}
    <div className="fixed bottom-10 right-6">
      <div className="relative h-[30px] w-[80px] sm:h-[43px] sm:w-[135px]">
        <Image
          src={"/assets/logo-new.svg"}
          alt="logo"
          height={43}
          width={135}
        />
      </div>
    </div>

    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        left: 0,
        position: "absolute",
        top: 0,
        width: "100%",
      }}
    >
      <div
        style={{
          color: "rgba(0, 0, 0, 0.15)",
          fontSize: `${8 * props.scale}rem`,
          fontWeight: "bold",
          textTransform: "uppercase",
          transform: "rotate(-45deg)",
          userSelect: "none",
        }}
      >
        Rezlinks
      </div>
    </div>
    {props.annotationLayer.children}
    {props.textLayer.children}
  </>
);

const PreviewResumeModal = ({
  onClose,
  resumeUrl,
}: {
  onClose: () => void;
  resumeUrl: any;
}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const pageLayout: any = {
    transformSize: ({ _, size }: { _: any; size: any }) => {
      return {
        height: size.height + 30,
        width: size.width,
      };
    },
  };

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

        <WaterMarkPreview fileUrl={resumeUrl} />
      </div>
    </div>
  );
};

export default PreviewResumeModal;
