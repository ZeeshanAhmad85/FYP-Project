import React from "react";

const Resume: React.FC<IconProps> = ({
  color = "#D0D5DD",
  width = 32,
  height = 32,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.66699 13.3333C4.66699 8.305 4.66699 5.79086 6.32673 4.22875C7.98645 2.66666 10.6577 2.66666 16.0003 2.66666H17.0306C21.3789 2.66666 23.553 2.66666 25.0629 3.73044C25.4955 4.03523 25.8795 4.39668 26.2034 4.80384C27.3337 6.22488 27.3337 8.27114 27.3337 12.3636V15.7576C27.3337 19.7085 27.3337 21.6839 26.7085 23.2616C25.7033 25.7981 23.5775 27.7988 20.8825 28.7448C19.2062 29.3333 17.1073 29.3333 12.9094 29.3333C10.5107 29.3333 9.31129 29.3333 8.35337 28.9971C6.81338 28.4565 5.59866 27.3132 5.02427 25.8639C4.66699 24.9623 4.66699 23.8335 4.66699 21.5757V13.3333Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M27.3333 16C27.3333 18.4545 25.3435 20.4444 22.8889 20.4444C22.0012 20.4444 20.9547 20.2889 20.0915 20.5201C19.3247 20.7256 18.7256 21.3247 18.5201 22.0915C18.2889 22.9547 18.4444 24.0012 18.4444 24.8889C18.4444 27.3435 16.4545 29.3333 14 29.3333"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.667 9.33334H20.0003"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.667 14.6667H14.667"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Resume;
