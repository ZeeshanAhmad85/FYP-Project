// components/shared/CustomTooltip.tsx
import React from 'react';

interface CustomTooltipProps {
  title: string;
  children: React.ReactNode;
}

const ToolTip: React.FC<CustomTooltipProps> = ({ title, children }) => {
  return (
    <div className="relative group flex flex-wrap">
      {children}
      <div className="absolute bottom-full z-40 w-[150px] text-wrap left-[-2rem] transform -translate-x-1/2 mb-2 px-2 py-1 text-text-quaternary bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {title}
      </div>
    </div>
  );
};

export default ToolTip;
