"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { fetchResumesByUserId } from "@/data/data";
import useAuthUser from "@/hooks/use-auth-user";
import { toast } from "sonner";
import { convertDateToResumeModified, formatTime } from "@/lib/utils";
import EmptyState from "@/components/shared/empty-state";

const initialData = [
  {
    name: "UI UX Resume",
    date: "14 Aug, 2024",
    public: 12,
    time: 12,
  },
  {
    name: "Developer Resume",
    date: "20 Aug, 2024",
    public: 30,
    time: 20,
  },
  {
    name: "Graphic Resume",
    date: "12Aug, 2024",
    public: 10,
    time: 20,
  },
  {
    name: "Web Developer Resume",
    date: "21 Aug, 2024",
    public: 29,
    time: 11,
  },
  {
    name: "UI UX Resume",
    date: "14 Aug, 2024",
    public: 12,
    time: 12,
  },
];

const OverviewTable = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [top5Resumes, setTop5Resumes] = useState<any[]>([]);

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const user = useAuthUser();

  const fetchResumesIfUserExists = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const fetchedResumes = await fetchResumesByUserId(user?.userId);
        setResumes(fetchedResumes);
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchResumesIfUserExists();
  }, [user]);

  const getAvgDurationResume = (resume: any) => {
    let totalDuration = 0;
    let count = 0;
    resume.links.forEach((link: any) => {
      link.sessions.forEach((session: any) => {
        if (session.duration !== null) {
          totalDuration += session.duration;
          count++;
        }
      });
    });

    const averageDuration = count > 0 ? totalDuration / count : 0;
    return averageDuration;
  };

  function calculateTop5Resumes(resumes: any) {
    const resumeDurations = resumes?.map((resume: any) => {
      const totalDuration = resume?.links?.reduce((acc: any, link: any) => {
        return (
          acc +
          link.sessions.reduce(
            (sessionAcc: any, session: any) => sessionAcc + session.duration,
            0
          )
        );
      }, 0);
      const averageDuration = getAvgDurationResume(resume);
      return {
        title: resume.title,
        totalDuration,
        avgDuration: averageDuration,
        time: resume.createdAt,
        totalLinks: resume.links.length,
      };
    });

    return resumeDurations
      ?.sort((a: any, b: any) => b.totalDuration - a.totalDuration)
      ?.slice(0, 5);
  }

  useEffect(() => {
    setTop5Resumes(calculateTop5Resumes(resumes));
  }, [resumes]);

  const handleSort = (key: any) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...top5Resumes].sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setTop5Resumes(sortedData);
  };

  const getArrowDirection = (key: any) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "rotate-0" : "rotate-180";
    }
    return "rotate-0";
  };

  return (
    <>
      {!isLoading && top5Resumes.length === 0 ? (
        <EmptyState img="/assets/dashboard/empty-table.svg" />
      ) : (
        <Table className="mt-2">
          <TableHeader className="bg-[#EAECF0] border-[1px] border-solid border-[#EAECF0]">
            <TableRow>
              <TableHead
                onClick={() => handleSort("time")}
                className="cursor-pointer"
              >
                <span className="flex gap-1 items-center justify-center ">
                  Resume Name
                  <Image
                    src="/assets/dashboard/arrow-table.svg"
                    alt="arrow"
                    width={16}
                    height={16}
                    className={`transition-transform ${getArrowDirection(
                      "time"
                    )}`}
                  />
                </span>
              </TableHead>
              <TableHead
                onClick={() => handleSort("totalLinks")}
                className="cursor-pointer"
              >
                <span className="flex gap-1 items-center ">
                  Public links
                  <Image
                    src="/assets/dashboard/arrow-table.svg"
                    alt="arrow"
                    width={16}
                    height={16}
                    className={`transition-transform ${getArrowDirection(
                      "totalLinks"
                    )}`}
                  />
                </span>
              </TableHead>
              <TableHead
                onClick={() => handleSort("avgDuration")}
                className="cursor-pointer"
              >
                <span className="flex gap-1 items-center ">
                  Average View Time
                  <Image
                    src="/assets/dashboard/arrow-table.svg"
                    alt="arrow"
                    width={16}
                    height={16}
                    className={`transition-transform ${getArrowDirection(
                      "avgDuration"
                    )}`}
                  />
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody>
              {[1, 1, 1, 1, 1].map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="text-text-primary text-center text-sm font-medium border-b-[1px] border-solid border-[#EAECF0]">
                      <div className="flex flex-col  gap-1">
                        <span className=" bg-gray-200 rounded-lg h-[20px] w-[200px]  dark:bg-gray-700 animate-pulse "></span>
                        <span className=" bg-gray-200 rounded-lg h-[20px] w-[100px]  dark:bg-gray-700 animate-pulse "></span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col   gap-1">
                        <span className=" bg-gray-200 rounded-lg h-[20px] w-[100px]  dark:bg-gray-700 animate-pulse "></span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col   gap-1">
                        <span className=" bg-gray-200 rounded-lg h-[20px] w-[100px]  dark:bg-gray-700 animate-pulse "></span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableBody>
              {top5Resumes.map((item: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="text-text-primary text-center text-sm font-medium border-b-[1px] border-solid border-[#EAECF0]">
                      <div className="flex flex-col item-center   gap-1">
                        <div className="flex items-start flex-col sm:pl-12  ">
                          <span className="text-text-primary text-sm font-medium ">
                            {item?.title}
                          </span>
                          <span className="text-text-placeholder text-sm font-medium">
                            {convertDateToResumeModified(item?.time)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-primary text-center text-sm font-medium border-b-[1px] border-solid border-[#EAECF0]">
                      {item?.totalLinks}
                    </TableCell>
                    <TableCell className="text-text-primary text-center text-sm font-medium border-b-[1px] border-solid border-[#EAECF0]">
                      {formatTime(item?.avgDuration)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      )}{" "}
    </>
  );
};

export default OverviewTable;
