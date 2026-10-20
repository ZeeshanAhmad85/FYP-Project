import * as React from "react";
import {
  RenderPage,
  RenderPageProps,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";

interface WaterMarkExampleProps {
  fileUrl: string;
}

const WaterMarkPreview: React.FC<WaterMarkExampleProps> = ({ fileUrl }) => {
  const renderPage: RenderPage = (props: RenderPageProps) => (
    <>
      {props.canvasLayer.children}
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
            color: "rgba(0, 0, 0, 0.2)",
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

  return (
    <div className="h-[80vh] mr-[30px] relative overflow-auto max-w-full  w-[400px]   sm:w-[500px]    md:w-[700px]">
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js`}
      >
        {" "}
        <Viewer fileUrl={fileUrl} renderPage={renderPage} />
      </Worker>
    </div>
  );
};

export default WaterMarkPreview;
