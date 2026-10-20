import React from "react";
import { format } from "date-fns";
interface FeedbackProps {
  rating: number;
  createdAt: string;
  feedbackText: string;
  title: any;
}

const Feedback: React.FC<FeedbackProps> = ({
  rating,
  createdAt,
  feedbackText,
  title,
}) => {
  const getStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < rating ? "#fbc02d" : "#e0e0e0"}
          className="w-6 h-6"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M12 17.27L18.18 21 16.54 14.02 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 14.02 5.82 21z" />
        </svg>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy");
  };

  return (
    <div className="border border-[#EAECF0] rounded-[8px] p-4 w-full mx-auto bg-white">
      <div className="flex flex-col xmd:flex-row xsm:items-center mb-2">
        {getStars(rating)}
        <span className="ml-2 text-[14px] text-[#7C8899]">
          {formatDate(createdAt)}
        </span>
      </div>
      <p className="text-[#344054] font-[500] text-[16px] text-base mb-4">
        {feedbackText}
      </p>
      <p className="text-[#356CB5] text-[14px] text-right font-[500]">{title}</p>
    </div>
  );
};

export default Feedback;
