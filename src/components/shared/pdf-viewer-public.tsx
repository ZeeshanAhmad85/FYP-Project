"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import type { PageLayout } from "@react-pdf-viewer/core";
import AlertModal from "./alert-modal";
import {
  createSession,
  getSessionsById,
  updateSession,
  getAnalyticsBySessionId,
  createAnalytics,
  updateAnalytics,
} from "@/data/data";
import { formatDate, createJsonFile } from "@/lib/utils";
import { uploadData } from "aws-amplify/storage";
import { downloadData } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
import output from "../../../amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { toast } from "sonner";

Amplify.configure(output);
const client = generateClient<Schema>({
  authMode: "apiKey",
});

import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import type {
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";

import StarRating from "./rating";
const initBeforeUnLoad = (showExitPrompt: boolean) => {
  window.onbeforeunload = (event) => {
    // Show prompt based on state
    if (showExitPrompt) {
      const e = event || window.event;
      e.preventDefault();
      if (e) {
        e.returnValue = "Are you sure u want to leave";
      }
      return "";
    }
  };
};

const generateSessionId = (): string =>
  `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

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

const PdfViewerPublic = ({
  resume,
  linkData,
  path,
  linkId,
  resumeId,
}: {
  resume: any;
  linkData: any;
  path: any;
  linkId: any;
  resumeId: any;
}) => {
  const [totalTime, setTotalTime] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [isTabVisible, setIsTabVisible] = useState(true);

  const [stats, setStats] = useState<{
    downloads: string[];
    pageTimes: { [key: number]: number };
    hover: { x: number; y: number; intensity: number; lastHoverTime: number }[];
  }>({
    downloads: [],
    pageTimes: {},
    hover: [],
  });

  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesViewed, setPagesViewed] = useState<Set<number>>(new Set());
  const [totalPages, setTotalPages] = useState(0);
  const [readingPercentage, setReadingPercentage] = useState(0);
  const [isInactive, setIsInactive] = useState(false);
  const [heatmap, setHeatmap] = useState<any>([]);

  const previousPageRef = useRef<number>(1);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pdfViewerRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(currentPage);

  // FEEDBACK MODAl
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const pageLayout: PageLayout = {
    transformSize: ({ numPages, size }) => {
      setTotalPages(numPages);
      const newWidth = size.width;
      const newHeight = size.height + 30;
      setDimensions({ width: newWidth, height: newHeight });
      return {
        height: size.height + 30,
        width: size.width,
      };
    },
  };

  const getSessionData = async (linkId: string) => {
    const sessions = await getSessionsById(linkId);
    return sessions;
  };

  const updateSessionData = async (id: string, totalTime: any) => {
    return await updateSession({ id, duration: totalTime });
  };

  useEffect(() => {
    const existingSessionId = sessionStorage.getItem("SessionId");

    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = generateSessionId();
      sessionStorage.setItem("SessionId", newSessionId);
      setSessionId(newSessionId);
      // console.log(sessionStorage.getItem("SessionId"));
      getSessionData(linkId)
        .then((sessions) => {
          const datetime = new Date().toISOString();
          // console.log(sessions);

          if (sessions && sessions.length > 0) {
            // const currentSession = sessions.filter(
            //   (session) => session.id === sessionId
            // );
            // setCurrSession(currentSession);
            return createSession({
              linkId: linkId,
              number: sessions.length + 1,
              openedTime: datetime,
            });
          } else {
            return createSession({
              linkId: linkId,
              number: 1,
              openedTime: datetime,
            });
          }
        })
        .then((createdSession) => {
          sessionStorage.setItem("id", createdSession?.id!);
        })
        .catch((error: any) => {
          console.error("Error creating session:", error);
        });
    }
  }, []);

  // console.log(heatmap);

  const statsRef = useRef(stats);
  const readingPercentageRef = useRef(readingPercentage);
  const heatmapRef = useRef(heatmap);

  const sendDataToDatabase = useCallback(async () => {
    const getHeatmapPaths = () => {
      // console.log(heatmapRef.current);
      return heatmapRef.current.map((item: any) => item.path);
    };

    const uploadFileToAmplify = async (
      file: any,
      fileName: string,
      category: string
    ) => {
      try {
        const result = await uploadData({
          path: `heatmaps/${fileName}`,
          data: file,
          options: {
            contentType: "application/json",
          },
        }).result;

        setHeatmap((prevHeatmap: any[]) => {
          const existingIndex = prevHeatmap.findIndex(
            (item) => item.category === category
          );

          if (existingIndex !== -1) {
            const updatedHeatmap = [...prevHeatmap];
            updatedHeatmap[existingIndex].path = result?.path!;
            return updatedHeatmap;
          } else {
            return [...prevHeatmap, { category, path: result?.path! }];
          }
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
      }
    };

    // console.log(heatmapRef.current);

    const handleHoverData = async (hoverData: any) => {
      try {
        const fileName = sessionStorage.getItem("id");
        const { blob } = createJsonFile(hoverData);
        await uploadFileToAmplify(blob, fileName!, "hover");
      } catch (error) {
        console.error("Error handling hover data:", error);
      }
    };

    try {
      const { downloads, pageTimes } = statsRef.current;
      console.log(downloads);
      const viewTime = JSON.stringify(pageTimes);
      const session = sessionStorage.getItem("id");
      handleHoverData(statsRef.current.hover);
      let heatmapdata = getHeatmapPaths();
      // if (heatmapdata.length > 0) heatmapdata = heatmapdata.shift();
      // // console.log(heatmapdata);
      // // return;

      const existingAnalytics = await getAnalyticsBySessionId({
        session_Id: session,
      });
      console.log(heatmapdata);
      console.log(statsRef.current.hover);
      if (existingAnalytics.length > 0) {
        const db_id = sessionStorage.getItem("statsId");
        console.log(db_id);

        await updateAnalytics({
          id: db_id!,
          sessionId: session!,
          viewTime,
          download: downloads,
          percentageRead: readingPercentageRef.current,
          heatmapId: heatmapdata,
        });
        // console.log("done");
      } else {
        const stats = await createAnalytics({
          sessionId: session!,
          viewTime,
          download: downloads,
          percentageRead: readingPercentageRef.current,
          heatmapId: heatmapdata,
        });
        sessionStorage.setItem("statsId", stats?.id!);
      }
    } catch (error) {
      console.error("Error updating or creating analytics:", error);
    }
  }, []);

  const sendDataToDatabaseRef = useRef(sendDataToDatabase);

  useEffect(() => {
    sendDataToDatabaseRef.current = sendDataToDatabase;
  }, [sendDataToDatabase]);

  // Update refs whenever state changes
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    readingPercentageRef.current = readingPercentage;
  }, [readingPercentage]);

  useEffect(() => {
    heatmapRef.current = heatmap;
  }, [heatmap]);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("hr");
      const id = sessionStorage.getItem("id");
      if (id) {
        try {
          const session = updateSessionData(id, totalTime);
          console.log(session);
          // console.log("Session updated successfully");
        } catch (error) {
          console.error("Error updating session:", error);
        }
      }
      sendDataToDatabaseRef.current();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      sessionStorage.setItem("totalTime", totalTime.toString());
      sessionStorage.setItem("pageTimes", JSON.stringify(stats.pageTimes));
      const id = sessionStorage.getItem("id");

      if (id) {
        try {
          const session = updateSessionData(id, totalTime);
          sendDataToDatabase();
          console.log(session);
          console.log("Session updated successfully");
        } catch (error) {
          console.error("Error updating session:", error);
        }
      }

      const message =
        "Are you sure you want to leave? All provided data will be lost.";
      // e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sendDataToDatabase, stats.pageTimes, totalTime]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    const total = sessionStorage.getItem("totalTime");
    const savedPageTimes = sessionStorage.getItem("pageTimes");
    if (savedPageTimes) {
      const parsedPageTimes = JSON.parse(savedPageTimes);
      setStats((prevStats) => ({
        ...prevStats,
        pageTimes: parsedPageTimes,
      }));
    }
    if (total) {
      setTotalTime(parseInt(total));
    }
  }, []);

  const MAX_TIME = 60000;
  const INACTIVITY_LIMIT = 60000;

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTimeRef.current;
      setTotalTime((prevTotalTime) => prevTotalTime + elapsedTime);
      setStats((prevStats) => {
        const newPageTimes = {
          ...prevStats.pageTimes,
          [currentPage]: (prevStats.pageTimes[currentPage] || 0) + elapsedTime,
        };
        return {
          ...prevStats,
          pageTimes: newPageTimes,
        };
      });
      startTimeRef.current = currentTime;
    }, 100);
  }, [currentPage]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resetInactivityTimeout = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      stopTimer();
      setIsInactive(true);
    }, INACTIVITY_LIMIT);
  }, [stopTimer]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      console.log(stats);
      const container = pdfViewerRef.current?.querySelector(
        `.rpv-core__text-layer`
      );
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (x < 0 || y < 0) return;

        setStats((prevStats: any) => {
          const newHoverPoint: any = {
            x,
            y,
            intensity: 10 + Math.random() * 50,
          };

          return {
            ...prevStats,
            hover: [...prevStats.hover, newHoverPoint],
          };
        });

        resetInactivityTimeout();
      }
    },
    [resetInactivityTimeout]
  );

  useEffect(() => {
    const container = pdfViewerRef.current;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          const innerPages = container?.querySelector(`.rpv-core__text-layer`);
          if (innerPages) {
            innerPages.addEventListener(
              "mousemove",
              handleMouseMove as EventListener
            );
            document.addEventListener(
              "scroll",
              resetInactivityTimeout as EventListener
            );
            document.addEventListener(
              "click",
              resetInactivityTimeout as EventListener
            );
          }
        }
      });
    });

    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      const innerPages = container?.querySelector(`.rpv-core__text-layer`);
      if (innerPages) {
        innerPages.removeEventListener(
          "mousemove",
          handleMouseMove as EventListener
        );
        innerPages.removeEventListener(
          "scroll",
          resetInactivityTimeout as EventListener
        );
        innerPages.removeEventListener(
          "click",
          resetInactivityTimeout as EventListener
        );
      }
    };
  }, [currentPage, handleMouseMove, resetInactivityTimeout]);

  useEffect(() => {
    const container = pdfViewerRef.current;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          const innerPages = container?.querySelector(
            `[data-testid="core__inner-current-page-${currentPage - 1}"]`
          );
          if (innerPages) {
            // console.log("here");
            innerPages.addEventListener(
              "mousemove",
              handleMouseMove as EventListener
            );
            document.addEventListener(
              "scroll",
              resetInactivityTimeout as EventListener
            );
            document.addEventListener(
              "click",
              resetInactivityTimeout as EventListener
            );
          }
        }
      });
    });

    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      const innerPages = container?.querySelector(
        `[data-testid="core__inner-current-page-${currentPage - 1}"]`
      );
      if (innerPages) {
        innerPages.removeEventListener(
          "mousemove",
          handleMouseMove as EventListener
        );
        innerPages.removeEventListener(
          "scroll",
          resetInactivityTimeout as EventListener
        );
        innerPages.removeEventListener(
          "click",
          resetInactivityTimeout as EventListener
        );
      }
    };
  }, [currentPage, handleMouseMove, resetInactivityTimeout]);

  useEffect(() => {
    if (pdfViewerRef?.current?.querySelector(".rpv-core__inner-pages")) {
      startTimer();
    }

    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
        setIsTabVisible(false);

        const id = sessionStorage.getItem("id");

        if (id) {
          try {
            const session = updateSessionData(id, totalTime);
            console.log(session);
            console.log("Session updated successfully");
          } catch (error) {
            console.error("Error updating session:", error);
          }
        }
      } else {
        if (pdfViewerRef?.current?.querySelector(".rpv-core__inner-pages")) {
          startTimer();
        }
        setIsTabVisible(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      const id = sessionStorage.getItem("id");

      if (id) {
        try {
          const session = updateSessionData(id, totalTime);
        } catch (error) {
          console.error("Error updating session:", error);
        }
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startTimer, stopTimer, totalTime]);

  const handleDownload = async () => {
    const link = document.createElement("a");
    try {
      const { body, eTag } = await downloadData({
        path: path,
        options: {
          // optional progress callback
          onProgress: (event) => {
            console.log(event.transferredBytes);
          },
        },
      }).result;

      const blob = new Blob([body as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "resume.pdf";
      console.log("body", body, eTag);
    } catch (error) {
      console.log("Error : ", error);
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const datetime = new Date().toISOString();

    try {
      const { data: linkdata, errors: linkerror } =
        await client.models.Link.get({
          id: linkId,
        });

      if (linkerror) {
        console.log("Error getting link data");
      }
      // console.log("link data:", linkdata);

      let userid = linkdata?.userId;
      let title = linkdata?.title;

      if (userid) {
        const { data: notification, errors } =
          await client.models.Notification.create({
            userId: userid,
            message: `Whoo! Your Resume from link \"${title}\" is just downloaded.`,
            messageTime: datetime,
          });

        if (errors) {
          console.log(errors, "ERROR ADDING NOTIFCATION ON LINK CREATION!");
        }

        // console.log(notification, "Notification added for link download");
      }
    } catch (error) {
      throw error;
    }

    setStats((prevStats) => {
      const newDownload = new Date().toISOString();
      return {
        ...prevStats,
        downloads: [...prevStats.downloads, newDownload],
      };
    });
  };

  const formatTime = (time: number) => {
    if (!time) return "0ms";

    if (time < 1000) {
      return `${time}ms`;
    } else if (time < 60000) {
      const seconds = (time / 1000).toFixed(2);
      return `${seconds}s`;
    } else if (time < 3600000) {
      const minutes = Math.floor(time / 60000).toString();
      const seconds = Math.floor((time % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      return `${minutes}min ${seconds}s`;
    } else {
      const hours = Math.floor(time / 3600000).toString();
      const minutes = Math.floor((time % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((time % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      return `${hours}h ${minutes}min ${seconds}s`;
    }
  };

  useEffect(() => {
    setPagesViewed((prevPagesViewed) => {
      const updatedPagesViewed = new Set(prevPagesViewed).add(currentPage);
      return updatedPagesViewed;
    });
    setReadingPercentage((pagesViewed.size / totalPages) * 100);
  }, [currentPage, pagesViewed.size, totalPages]);

  const handlePageChange = (e: any) => {
    stopTimer();
    setCurrentPage(e.currentPage + 1);
    startTimer();
  };

  const handleCommentChange = (e: any) => {
    setComment(e.target.value);
  };
  const handleRatingChange = (newRating: any) => {
    setRating(newRating);
  };

  const handleSubmitFeedback = async () => {
    if (comment.length === 0 || rating === 0) {
      alert("Please provide a rating and comment");
      return;
    }
    try {
      const { data: feedback, errors } = await client.models.Feedback.create({
        resumeId: resumeId,
        text: comment,
        rating: rating,
      });

      toast.success("Feedback submitted successfully");

      // console.log(feedback, "Feedback created successfully");
      setIsOpenModal(false);
    } catch (error) {
      console.error("Error creating feedback:", error);
    }
  };

  //  TOOLBAR PLUGIN

  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    EnterFullScreen: () => <></>,
    EnterFullScreenMenuItem: () => <></>,
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>,
  });
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [],
  });

  return (
    <>
      <div>
        <div className="sm:sticky z-[100] sm:h-20 inset-x-0 py-4 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all ">
          <div className="max-w-[90%] w-full mx-auto flex flex-col gap-5 xsm:gap-0 xsm:flex-row justify-between items-center ">
            <h2 className="text-[20px] sm:text-[32px] font-bold text-text-primary">
              {linkData?.title.toUpperCase()}
            </h2>
            <div className="flex gap-3 sm:gap-5 sm:flex-row flex-col">
              <Button
                className="bg-primary h-[48px] text-white text-[16px] font-bold py-3 px-5 rounded-[8px] flex items-center space-x-2"
                onClick={handleDownload}
              >
                {" "}
                <span>Download Resume</span>
                <Image
                  src={"/assets/download.svg"}
                  alt="upload"
                  height={24}
                  width={24}
                />
              </Button>
              <Button
                variant={"outline"}
                className="border-primary h-[48px] text-white text-[16px] font-bold py-3 px-5 rounded-[8px] flex items-center space-x-2"
                onClick={() => setIsOpenModal(true)}
              >
                {" "}
                <span className="text-primary text-base font-bold">
                  Give Feedback
                </span>
                <Image
                  src={"/assets/feedback.svg"}
                  alt="upload"
                  height={24}
                  width={24}
                />
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              maxWidth: "90%",
              height: "1500px",
              margin: "8px auto",
            }}
            ref={pdfViewerRef}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
              <Viewer
                fileUrl={resume}
                plugins={[toolbarPluginInstance]}
                pageLayout={pageLayout}
                renderPage={renderPage}
                defaultScale={SpecialZoomLevel.PageFit}
                onPageChange={handlePageChange}
              />
            </Worker>
          </div>
        </div>
        {/* <div className="py-3">
          <p>Total Time Spent: {formatTime(totalTime)}</p>
          <div>
            <h3>Page Times</h3>
            <ul>
              {Object.entries(stats.pageTimes).map(([page, time], index) => (
                <li key={index}>
                  Page {page}: {formatTime(time as number)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Download Stats</h3>
            <ul>
              {stats.downloads.map((download, index) => (
                <li key={index}>{new Date(download).toLocaleString()}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Mouse Hover Data</h3>
            <ul>
              {stats.hover.map((hoverData, index) => (
                <li key={index}>
                  <p>
                    X: {hoverData.x.toFixed(2)}, Y: {hoverData.y.toFixed(2)},
                    Intensity: {hoverData.intensity}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Reading Progress</h3>
            <p>Percentage Read: {readingPercentage.toFixed(2)}%</p>
          </div>
        </div> */}
      </div>
      <AlertModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        className="w-[512px] max-w-[512px] z-[10000]"
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold text-text-primary">
              Your Feedback is Appreciated!
            </h2>
            <button
              className="bg-[#EAECF0] rounded-[8px] p-2 cursor-pointer"
              onClick={() => setIsOpenModal(false)}
            >
              <Image src="/assets/cross.svg" alt="" width={16} height={16} />
            </button>
          </div>

          <StarRating onChange={handleRatingChange} />
          <div className="flex flex-col gap-1">
            <label className="font-medium text-text-quaternary text-sm">
              Leave some comments
            </label>
            <textarea
              className="w-full h-[200px] border border-[#D0D5DD] rounded-[8px] p-4 shadow-[0px_1px_2_0] ring-offset-input 
             placeholder:text-text-placeholder transition duration-200 ease-in-out focus:border-[1px] focus:border-solid focus:border-[#356CB5] focus:outline-none focus:ring-2 focus:ring-[#356CB5] disabled:cursor-not-allowed  disabled:text-text-placeholder 
              "
              placeholder="Share your thoughts..."
              value={comment}
              onChange={handleCommentChange}
            ></textarea>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row mt-2">
            <Button
              variant={"outline"}
              className=" grow h-[48px] bg-white text-text-primary text-[14px] font-bold py-3 px-5 rounded-[8px] flex items-center space-x-2"
            >
              Close
            </Button>
            <Button
              className="grow bg-primary h-[48px] text-white text-[14px] font-bold py-3 px-5 rounded-[8px] flex items-center space-x-2"
              onClick={handleSubmitFeedback}
            >
              {" "}
              Submit
            </Button>
          </div>
        </div>
      </AlertModal>
    </>
  );
};

export default PdfViewerPublic;