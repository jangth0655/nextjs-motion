interface PageNationProps {
  pageBack?: (back: boolean) => void;
}

const PageNation = ({ pageBack }: PageNationProps) => {
  return (
    <div className="flex w-full justify-center space-x-2 pb-2">
      {pageBack && (
        <>
          <div
            onClick={() => pageBack(true)}
            className="bg-orange-300 text-center text-white cursor-pointer hover:bg-orange-500 transition-all"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <div
            onClick={() => pageBack(false)}
            className="bg-orange-300 text-center text-white cursor-pointer hover:bg-orange-500 transition-all"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default PageNation;
