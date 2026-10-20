type StatusDotProps = {
    isActive: boolean;
    isAll: boolean;
    isDropdown: boolean;
  };
  
  const StatusDot: React.FC<StatusDotProps> = ({ isActive, isAll, isDropdown }) => {
    let dotColor;
    let ringClass = "";
  
    if (isAll) {
      dotColor = "bg-[#D0D5DD]";
    } else {
      dotColor = isActive ? "bg-[#027A48]" : "bg-[#F04438]";
      if (!isDropdown) {
        ringClass = isActive ? "ring-[#027A4840]" : "ring-[#F0443840]";
      }
    }
  
    return (
      <div className="flex justify-center items-center">
        <div
          className={`w-2 h-2 rounded-full ${dotColor} ${ringClass ? `ring-4 ring-opacity-50 ${ringClass}` : ""}`}
        ></div>
      </div>
    );
  };
  
  export default StatusDot;
  