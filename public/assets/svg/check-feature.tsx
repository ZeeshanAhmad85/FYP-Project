import React from "react";

interface CheckFeatureProps {
  color?: string;
}

const CheckFeature: React.FC<CheckFeatureProps> = ({ color = "#356CB5" }) => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.666 3.33782C16.1951 2.48697 14.4874 2 12.666 2C7.14317 2 2.66602 6.47715 2.66602 12C2.66602 17.5228 7.14317 22 12.666 22C18.1888 22 22.666 17.5228 22.666 12C22.666 11.3151 22.5971 10.6462 22.466 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.66602 12.5C8.66602 12.5 10.166 12.5 12.166 16C12.166 16 17.7248 6.83333 22.666 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckFeature;
