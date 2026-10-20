import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const Plan: React.FC<IconProps> = ({
  width = 32,
  height = 32,
  fill = "none",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.33398 14.6667V20C5.33398 24.3997 5.33398 26.5996 6.70082 27.9665C8.06765 29.3333 10.2675 29.3333 14.6673 29.3333H17.334C21.7337 29.3333 23.9336 29.3333 25.3005 27.9665C26.6673 26.5996 26.6673 24.3997 26.6673 20V14.6667"
      stroke="#D0D5DD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 12C4 11.0031 4 10.5046 4.26795 10.1333C4.44348 9.89011 4.69596 9.68812 5 9.54769C5.46411 9.33333 6.08717 9.33333 7.33333 9.33333H24.6667C25.9128 9.33333 26.5359 9.33333 27 9.54769C27.304 9.68812 27.5565 9.89011 27.732 10.1333C28 10.5046 28 11.0031 28 12C28 12.9969 28 13.4953 27.732 13.8667C27.5565 14.1099 27.304 14.3119 27 14.4523C26.5359 14.6667 25.9128 14.6667 24.6667 14.6667H7.33333C6.08717 14.6667 5.46411 14.6667 5 14.4523C4.69596 14.3119 4.44348 14.1099 4.26795 13.8667C4 13.4953 4 12.9969 4 12Z"
      stroke="#D0D5DD"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M8 5.04761C8 3.73265 9.06599 2.66667 10.3809 2.66667H10.8571C13.6975 2.66667 16 4.9692 16 7.80952V9.33333H12.2857C9.91877 9.33333 8 7.41455 8 5.04761Z"
      stroke="#D0D5DD"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M24 5.04761C24 3.73265 22.934 2.66667 21.6191 2.66667H21.1428C18.3025 2.66667 16 4.9692 16 7.80952V9.33333H19.7143C22.0812 9.33333 24 7.41455 24 5.04761Z"
      stroke="#D0D5DD"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M16 14.6667V29.3333"
      stroke="#D0D5DD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Plan;
