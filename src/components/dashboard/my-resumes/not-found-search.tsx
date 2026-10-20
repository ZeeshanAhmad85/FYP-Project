import Image from "next/image";

function NotFoundSearch() {
  return (
    <div className="pb-3 flex flex-col w-full items-center space-y-5">
      <div className="relative h-[105px] w-[152px]">
        <Image src="/assets/not-found-search.svg" alt="search" fill priority />
      </div>
      <div>
        <p className="text-[14px] font-[500] text-text-quaternary">
          Try searching with different keywords and make sure your resume is
          uploaded.
        </p>
      </div>
    </div>
  );
}

export default NotFoundSearch;
