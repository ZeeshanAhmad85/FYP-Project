import React, { useEffect, useState, useRef } from "react";
import RadialGraph from "@/components/dashboard/my-links/radial-graph";
import Upgrade from "@/components/shared/upgrade-component";
import { PDFDocumentProxy, getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { redirectResumePath } from "@/lib/utils";
import { downloadData } from "aws-amplify/storage";
import Heatmap from "visual-heatmap";
import useAuthUser from "@/hooks/use-auth-user";
// import ToolTip from "@/components/dashboard/my-links/tooltip";
// import { LockKeyhole } from "lucide-react";
import { uploadData } from "aws-amplify/storage";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.111/pdf.worker.min.js`;

const HeatmapComponent: React.FC<{
  url: string;
  percentageRead: number;
  heatmapIds: any;
  linkId: string;
}> = ({ url, percentageRead, heatmapIds, linkId }) => {
  const user = useAuthUser();
  const SUBSCRIPTION = user?.["custom:subscription"];

  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [combinedImage, setCombinedImage] = useState<string | undefined>(
    undefined
  );
  const heatmapContainerRef = useRef<any>(null);
  const [minIntensity, setMinIntensity] = useState<number>();
  const [maxIntensity, setMaxIntensity] = useState<number>();
  const [mouseData, setMouseData] = useState<any[]>([]);
  const [height, setHeight] = useState(1484);
  const [width, setWidth] = useState(1049.2395634892284);
  const [heatmapImageUrl, setHeatmapImageUrl] = useState<string | undefined>(
    undefined
  ); // New state for the PNG image

  // console.log(heatmapImageUrl);

  const loadPdfFromBlob = async (blob: Blob) => {
    const pdf = await getDocument(URL.createObjectURL(blob)).promise;
    return pdf;
  };

  const uploadHeatmapImage = async (imageUrl: string, linkId: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const newFileName = `thumbnails/${linkId}.png`;

      const result = await uploadData({
        path: newFileName,
        data: blob,
        options: {
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round(
                (transferredBytes / totalBytes) * 100
              );
              `Upload Progress: ${progress}%`;
            }
          },
          contentType: "image/png",
        },
      }).result;
    } catch (error) {
      console.error("Error uploading heatmap image:", error);
    }
  };

  const renderPageToCanvas = async (
    pdf: PDFDocumentProxy,
    pageNumber: number
  ) => {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.9 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to get canvas context");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    context.fillStyle = "rgba(174, 166, 181, 0.5)"; // Semi-transparent overlay color
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;
  };

  const combinePagesIntoSingleImage = async (pdf: PDFDocumentProxy) => {
    const numPages = pdf.numPages;
    const canvasList: HTMLCanvasElement[] = [];
    let totalHeight = 0;
    let maxWidth = 0;

    // Render each page to a canvas
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const canvas = await renderPageToCanvas(pdf, pageNumber);
      canvasList.push(canvas);
      totalHeight += canvas.height;
      maxWidth = canvas.width;
      // setHeight(totalHeight);
    }

    // Create a new canvas to combine all pages
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = maxWidth;
    combinedCanvas.height = totalHeight;
    const combinedContext = combinedCanvas.getContext("2d");
    if (!combinedContext)
      throw new Error("Failed to get combined canvas context");

    let offsetY = 0;

    // Draw each canvas onto the combined canvas
    canvasList.forEach((canvas) => {
      combinedContext.drawImage(canvas, 0, offsetY);
      offsetY += canvas.height;
    });
    setHeight(offsetY);
    // setWidth(maxWidth);

    return combinedCanvas.toDataURL("image/png");
  };

  const fetchHeatmapJson = async (path: string) => {
    try {
      const result = await downloadData({
        path: path,
        options: {
          onProgress: (event) => {},
        },
      }).result;

      const text = await result.body.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error fetching heatmap JSON:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchHeatmapData = async () => {
      if (Array.isArray(heatmapIds)) {
        const allMouseData = [];
        let min = Infinity;
        let max = -Infinity;

        console.log(heatmapIds);

        for (const heatmapPath of heatmapIds) {
          const mouseData = await fetchHeatmapJson(heatmapPath);
          if (mouseData) {
            allMouseData.push(...mouseData);

            mouseData.forEach((point: any) => {
              if (point.intensity < min) min = point.intensity;
              if (point.intensity > max) max = point.intensity;
            });
          }
        }

        setMouseData(allMouseData);
        setMinIntensity(min);
        setMaxIntensity(max);
      } else {
        const mouseData = await fetchHeatmapJson(heatmapIds);
        if (mouseData) {
          setMouseData(mouseData);

          let min = Infinity;
          let max = -Infinity;
          mouseData.forEach((point: any) => {
            if (point.intensity < min) min = point.intensity;
            if (point.intensity > max) max = point.intensity;
          });

          setMinIntensity(min);
          setMaxIntensity(max);
        }
      }
    };

    fetchHeatmapData();
  }, [heatmapIds]);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const path = await redirectResumePath(url);
        setPdfUrl(path);

        if (path) {
          const result = await downloadData({
            path: path,
            options: {
              onProgress: (event) => {},
            },
          }).result;

          const blob = new Blob([result.body as any], {
            type: "application/pdf",
          });

          const pdf = await loadPdfFromBlob(blob);
          const image = await combinePagesIntoSingleImage(pdf);

          setCombinedImage(image);
        }
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, [url]);

  useEffect(() => {
    const initializeHeatmap = () => {
      if (!combinedImage || !heatmapContainerRef.current) return;

      const backgroundImage = new Image();
      backgroundImage.src = combinedImage;

      // Ensure the background image is loaded before proceeding
      backgroundImage.onload = () => {
        // Create a canvas for the background image
        const backgroundCanvas = document.createElement("canvas");
        const backgroundContext = backgroundCanvas.getContext("2d");
        if (!backgroundContext)
          throw new Error("Failed to get background canvas context");

        // Set canvas dimensions to match the background image
        backgroundCanvas.width = backgroundImage.width;
        backgroundCanvas.height = backgroundImage.height;

        // Draw the background image onto the canvas
        backgroundContext.drawImage(backgroundImage, 0, 0);

        // Initialize the heatmap
        const heatmapInstance = new (Heatmap as any)(
          heatmapContainerRef.current,
          {
            size: 90.0,
            max: 280,
            min: 0,
            intensity: 0.8,
            opacity: 0.5,
            zoom: 1.0,
            backgroundImage: {
              url: combinedImage,
            },
            gradient: [
              { color: [0, 0, 0, 0.0], offset: 0 },
              { color: [0, 0, 255, 0.2], offset: 0.1 },
              { color: [0, 0, 255, 0.5], offset: 0.26 },
              { color: [0, 255, 0, 0.5], offset: 0.56 },
              { color: [255, 255, 0, 1.0], offset: 0.76 },
              { color: [255, 0, 0, 1.0], offset: 0.99 },
              { color: [177, 62, 45, 1.0], offset: 1.0 },
            ],
          }
        );

        // Prepare heatmap data
        const heatmapData = mouseData.map(({ x, y, intensity }) => ({
          x,
          y,
          value: intensity,
        }));

        // Render the heatmap data
        heatmapInstance.renderData(heatmapData);

        // Create a canvas to combine heatmap and background image
        const combinedHeatmapCanvas = document.createElement("canvas");
        combinedHeatmapCanvas.width = backgroundImage.width;
        combinedHeatmapCanvas.height = backgroundImage.height;

        const combinedHeatmapContext = combinedHeatmapCanvas.getContext("2d");
        if (!combinedHeatmapContext)
          throw new Error("Failed to get combined heatmap canvas context");

        // Draw the background image onto the combined canvas
        combinedHeatmapContext.drawImage(backgroundCanvas, 0, 0);

        // Draw the heatmap onto the combined canvas
        const heatmapCanvas =
          heatmapContainerRef.current.querySelector("canvas");
        if (heatmapCanvas) {
          combinedHeatmapContext.drawImage(
            heatmapCanvas,
            0,
            0,
            backgroundImage.width,
            backgroundImage.height
          );
        }

        // Convert the combined canvas to a PNG image URL
        const imageUrl = combinedHeatmapCanvas.toDataURL("image/png");
        setHeatmapImageUrl(imageUrl);
        console.log(imageUrl);

        // Call uploadHeatmapImage with the generated image URL and the linkId
        uploadHeatmapImage(imageUrl, linkId);
      };
    };

    initializeHeatmap();
  }, [combinedImage, mouseData, linkId]);

  return (
    <div className="relative   flex flex-col space-y-6 xl:space-y-0 xl:flex-row xl:justify-center xl:space-x-12 p-6 bg-white">
      {/* {SUBSCRIPTION !== "PRO" && (
        <div className="absolute inset-0 rounded-[8px] z-30  bg-black bg-opacity-10 backdrop-blur-lg flex justify-center items-center cursor-pointer">
          <ToolTip title="Upgrade to Pro to see">
            <div className="flex items-center justify-center w-full h-full ">
              <LockKeyhole size={48} className="text-text-primary" />
            </div>
          </ToolTip>
        </div>
      )} */}
      {heatmapIds && percentageRead ? (
        <>
          <div
            className={`border rounded-[8px] ${
              heatmapIds === 1 ? "overflow-hidden" : " "
            } overflow-y-auto xl:max-w-[800px] 2xl:max-w-[800px] 3xll:max-w-none`}
          >
            {/* {heatmapIds.length === 1 && (
              <div className="w-full flex items-center">
                <span className=" text-[#4b5563] mx-[2rem] my-[3rem]  text-center">
                  No heatmap :(
                </span>
              </div>
            )} */}
            <div
              ref={heatmapContainerRef}
              style={{ height: `${height}px`, width: `${width}px` }}
              className={`heatmap-container  relative`}
            ></div>
          </div>

          <div className="flex flex-col space-y-5 h-full items-center">
            <div className="mb-6 w-full text-center">
              <RadialGraph percent={percentageRead} />
              <div className="mt-8 flex flex-col gap-y-5">
                <div className="flex items-center mb-2">
                  <span className="w-4 h-4 rounded-[4px] bg-red-500 inline-block mr-2"></span>
                  <span>Most Focused</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="w-4 h-4 rounded-[4px] bg-yellow-500 inline-block mr-2"></span>
                  <span>Average Focused</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 rounded-[4px] bg-green-500 inline-block mr-2"></span>
                  <span>Least Focused</span>
                </div>
              </div>
            </div>

            {SUBSCRIPTION !== "PRO" && <Upgrade />}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center text-[#4b5563] w-full h-full">
          <span>Nothing to show</span>
        </div>
      )}
    </div>
  );
};

export default HeatmapComponent;
