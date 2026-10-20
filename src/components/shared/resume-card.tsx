"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import StatusDot from "../dashboard/my-resumes/status-dot";
import { convertDateToResumeModified } from "@/lib/utils";
import { getUrl } from "aws-amplify/storage";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.111/pdf.worker.min.js`;

interface ResumeCardProps {
  title: string;
  lastModified: string;
  links: any;
  thumbnailPath: string;
  isActive: boolean;
  id: any;
  onEditClick: any;
  onLinkClick?: (links: any, title: string) => void;
  refetchThumbnail?: any;
  onPreviewClick?: any;
  heatmap: any;
  onPreviewHeatmap: any;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  title,
  lastModified,
  links,
  thumbnailPath,
  isActive,
  onEditClick,
  onLinkClick,
  id,
  refetchThumbnail,
  onPreviewClick,
  heatmap,
  onPreviewHeatmap,
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [pageThumbnail, setPageThumbnail] = useState<string>("");

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const linkToStorageFile = await getUrl({
          path: thumbnailPath,
          options: {
            validateObjectExistence: false,
            expiresIn: 900,
            useAccelerateEndpoint: false,
          },
        });

        setThumbnailUrl(linkToStorageFile?.url?.href);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResumeUrl();
  }, [refetchThumbnail]);

  useEffect(() => {
    const renderFirstPageThumbnail = async () => {
      try {
        const linkToStorageFile = await getUrl({
          path: thumbnailPath,
          options: {
            validateObjectExistence: false,
            expiresIn: 900,
            useAccelerateEndpoint: false,
          },
        });

        const pdfBlob = await fetch(linkToStorageFile?.url?.href).then((res) =>
          res.blob()
        );
        const pdf = await getDocument(URL.createObjectURL(pdfBlob)).promise;

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
        }
        const imageData = canvas.toDataURL("image/png");
        setPageThumbnail(imageData);
      } catch (error) {
        console.error("Error rendering first page thumbnail:", error);
      }
    };

    renderFirstPageThumbnail();
  }, [thumbnailPath]);

  const linkModalHandler = (links: any) => {
    onLinkClick && onLinkClick(links, title);
  };

  const previewHandler = () => {
    onPreviewClick && onPreviewClick(thumbnailUrl);
  };
  const previewHeatmap = () => {
    onPreviewHeatmap && onPreviewHeatmap(heatmap || pageThumbnail);
  };

  return (
    <div className="border border-[#EAECF0] bg-[#FFFFFF] rounded-[8px] p-4 flex flex-col justify-center space-y-4 w-full 3xll:w-full relative group">
      <div className="relative w-[100%] h-[194px] overflow-hidden rounded-[8px]">
        {pageThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pageThumbnail}
            alt="Resume Thumbnail"
            className="w-full object-top"
          />
        ) : (
          <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700 animate-pulse">
            <svg
              className="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 20"
            >
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-[#000000CC] hover:cursor-pointer flex flex-col justify-center items-center py-4 space-y-2 opacity-0 hover:opacity-90 transition-opacity duration-300  px-4">
          <div className="flex flex-col justify-center px-3 py-4 space-y-3 w-full">
            <Button
              size={"default"}
              className="px-4 flex hover:bg-[#F4F4F4]  justify-between w-full py-2 text-text-quaternary font-[500] bg-white rounded-[8px]"
              onClick={previewHeatmap}
            >
              <span className="mr-2 text-[14px]">View Heatmap</span>
              <Image src="/assets/heatmap.svg" alt="" height={16} width={16} />
            </Button>
            <Button
              size={"default"}
              className="px-4 py-2 hover:bg-[#F4F4F4]  justify-between w-full text-text-quaternary font-[500] bg-white rounded-[8px]"
              onClick={previewHandler}
            >
              <span className="mr-2 text-[14px]">Preview Resume</span>
              <Image src="/assets/Eye.svg" alt="" height={16} width={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold mt-2">{title}</h2>
            <p className="text-gray-500 mt-2 text-[14px]">
              Last Modified: {convertDateToResumeModified(lastModified)}
            </p>
          </div>
          <StatusDot isActive={isActive} isAll={false} isDropdown={false} />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 w-full">
          <Button
            size={"default"}
            className="px-4 flex-1 py-2 border text-[14px] border-[#EAECF0] hover:bg-[#F4F4F4] bg-white text-text-quaternary font-[500] rounded-[8px]"
            style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
            onClick={() => onEditClick(id)}
          >
            <Image src="/assets/edit-2.svg" alt="" height={16} width={16} />
            <span className="ml-2">Edit</span>
          </Button>
          <Button
            size={"default"}
            className="px-4 flex-1 py-2 text-[14px] border border-[#EAECF0] hover:bg-[#F4F4F4] bg-white text-text-quaternary font-[500] rounded-[8px]"
            style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
            onClick={() => linkModalHandler(links)}
          >
            <Image src="/assets/link-2.svg" alt="" height={24} width={24} />
            <span>Links({links?.length})</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
