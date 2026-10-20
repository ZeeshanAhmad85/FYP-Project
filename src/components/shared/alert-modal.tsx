// components/Modal.tsx
import { cn } from "@/lib/utils";
import React from "react";

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div
        className={cn(
          `bg-white p-6 rounded-[12px] shadow-lg relative max-w-[544px] alert-shadow`,
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default AlertModal;
