const LinkRowSkeleton = () => {
  return (
    <div className="animate-pulse flex bg-gray-200 min-h-[166px] p-2 border border-gray-300 rounded-[8px]">
      <div className="w-[140px] h-[150px] bg-gray-300 rounded-[8px] mr-4"></div>
      <div className="flex-1 px-3 py-2 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="space-x-2 flex">
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkRowSkeleton;
