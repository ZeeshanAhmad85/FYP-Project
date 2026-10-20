
import React from 'react';

const FeedbackCardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-gray-200 animate-pulse p-4 rounded-md shadow-md">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
    </div>
  );
};

export default FeedbackCardSkeleton;
