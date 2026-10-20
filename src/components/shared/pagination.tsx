interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex text-[14px] justify-center items-center space-x-4 my-4">
      <button
        onClick={handlePrevious}
        className={`px-4 py-2 rounded-[8px] text-[14px] font-[500] text-text-primary-foreground ${
          currentPage === 1
            ? "cursor-not-allowed text-[#98A2B3]"
            : "hover:bg-gray-200 bg-[#EAECF0]"
        }`}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="text-text-quaternary font-[500]">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        className={`px-4 py-2 rounded-[8px] font-[500] text-text-primary-foreground ${
          currentPage === totalPages
            ? "cursor-not-allowed bg-transparent text-[#98A2B3] "
            : "bg-[#EAECF0]"
        }`}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
