"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/shared/header";
import UpgradeBanner from "@/components/shared/upgrade-banner";
import StatCard from "@/components/shared/stats-card";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import useAuthUser from "@/hooks/use-auth-user";
import { toast } from "sonner";
import { fetchResumesByUserId, fetchFeedbackByResumeId } from "@/data/data";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import Feedback from "@/components/dashboard/feedbacks/feedback-card";
import FeedbackCardSkeleton from "@/components/dashboard/feedbacks/feedback-skeleton";
import Image from "next/image";
import { addDays } from "date-fns";

// Ensure this matches the expected DateRange type
interface DateRange {
  from: Date;
  to: Date;
}

interface FeedbackType {
  resumeId: string;
  rating: number;
  date: string;
  text: string;
  title: string;
  createdAt: any;
}

interface ResumeType {
  id: string;
  title: string;
}

function Page() {
  const user = useAuthUser();
  const SUBSCRIPTION = user?.["custom:subscription"];
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [resume, setResume] = useState<ResumeType[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeType | undefined>(
    undefined
  );
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackType[]>([]);
  const [date, setDate] = React.useState<DateRange>({
    from: addDays(new Date(), -365), // One year ago from today
    to: new Date(),
  });

  const fetchFeedbacks = async (id: string) => {
    if (user) {
      try {
        setIsLoadingStats(true);
        const fetchedFeedbacks = await fetchFeedbackByResumeId(id);
        return fetchedFeedbacks;
      } catch (error) {
        toast.error(`${error}`);
        return [];
      } finally {
        setIsLoadingStats(false);
      }
    }
  };

  const fetchResumeData = async () => {
    if (user) {
      try {
        setIsLoadingStats(true);
        const fetchedResumes = await fetchResumesByUserId(user.userId);
        setResume(
          fetchedResumes.map((resume: any) => ({
            id: resume.id,
            title: resume.title,
          }))
        );

        const allFeedbacks: any = [];
        for (const resume of fetchedResumes) {
          const resumeFeedbacks = await fetchFeedbacks(resume.id);
          if (resumeFeedbacks) {
            allFeedbacks.push(...resumeFeedbacks);
          }
        }
        setFeedback(allFeedbacks);
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setIsLoadingStats(false);
      }
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, [user]);

  useEffect(() => {
    if (resume.length > 0) {
      const initialResume = resume[0];
      setSelectedResume(initialResume);
    }
  }, [resume]);

  useEffect(() => {
    if (selectedResume) {
      const filtered = feedback.filter((feedback) => {
        const feedbackDate = new Date(feedback?.createdAt);
        const startDate = date.from;
        const endDate = addDays(date.to, 1);
        return (
          feedback.resumeId === selectedResume.id &&
          feedbackDate >= startDate &&
          feedbackDate <= endDate
        );
      });
      setFilteredFeedback(filtered);
    }
  }, [selectedResume, feedback, date]);

  const calculateAverageRating = (feedbacks: FeedbackType[]): number => {
    if (feedbacks.length === 0) {
      return 0;
    }
    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0
    );
    return totalRating / feedbacks.length;
  };

  const countFiveStarFeedbacks = (feedbacks: FeedbackType[]): number => {
    return feedbacks.filter((feedback) => feedback.rating === 5).length;
  };

  const countCriticalReviews = (feedbacks: FeedbackType[]): number => {
    return feedbacks.filter((feedback) => feedback.rating < 3).length;
  };

  const feedbacks = [
    {
      title: "Total Reviews",
      stats: feedback.length.toString(),
      icon: "/assets/svg/star.svg",
    },
    {
      title: "Average Rating",
      stats: calculateAverageRating(feedback).toFixed(1),
      icon: "/assets/svg/star-2.svg",
    },
    {
      title: "Critical Reviews",
      stats: countCriticalReviews(filteredFeedback).toString(),
      icon: "/assets/svg/critical.svg",
    },
  ];

  const handleResumeChange = (id: string) => {
    const matchingResume = resume.find((resumeOne) => resumeOne.id === id);
    if (matchingResume) {
      setSelectedResume(matchingResume);
    }
  };

  return (
    <div className="w-full h-full flex flex-col py-2 px-5 sm:px-8">
      {SUBSCRIPTION !== "PRO" && <UpgradeBanner />}
      <Header
        title="My Feedbacks"
        subtitle="Check what recruiters have to say about your resume"
        buttonText=""
        buttonIconPath=""
        onButtonClick={() => {}}
      >
        <div className="flex flex-col sm:flex-row sm:flex-wrap md:items-center sm:space-y-0 sm:space-x-3 py-3">
          {feedbacks.map((stats, index) => (
            <div key={index} className="flex-1 sm:max-w-[500px]">
              <StatCard
                title={stats.title}
                value={stats.stats}
                iconPath={stats.icon}
                isLoading={isLoadingStats}
              />
            </div>
          ))}
        </div>
      </Header>
      <div className="w-full flex flex-col sm:flex-row sm:justify-between">
        <div className="flex xsm:flex-row w-full flex-col space-y-4 xsm:space-y-0 xsm:space-x-2 sm:w-[60%] sm:max-w-[400px] ">
          <Select value={selectedResume?.id} onValueChange={handleResumeChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select Resume" />
            </SelectTrigger>
            <SelectContent>
              {resume?.map((resume) => (
                <SelectItem key={resume?.id} value={resume?.id}>
                  <div className="flex pl-2 space-x-3">
                    <span>{resume?.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      <div className="w-full">
        <h1 className="text-[#344054] pt-6 font-[700] text-[24px]">
          {selectedResume?.title}
        </h1>
        {isLoadingStats ? (
          <div className="grid justify-items-center gap-6 w-full grid-cols-1 sm:grid-cols-2 py-6 3xll:justify-self-center ">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-full">
                <FeedbackCardSkeleton />
              </div>
            ))}
          </div>
        ) : feedback?.length > 0 ? (
          <div className="grid justify-items-center gap-6 w-full grid-cols-1 sm:grid-cols-2 pt-6 pb-10 3xll:justify-self-center ">
            {filteredFeedback?.map((feedback, index) => (
              <div key={index} className="w-full">
                <Feedback
                  rating={feedback?.rating}
                  createdAt={feedback?.createdAt!}
                  feedbackText={feedback?.text}
                  title={selectedResume?.title}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center flex flex-col space-y-6 items-center text-gray-500 pt-6 pb-10">
            <Image
              src="/assets/myresume/link-empty.svg"
              alt="Empty"
              width={200}
              height={300}
            />
            <span>No feedbacks available.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
