interface ErrorProps {
  text?: string;
}

const Error = ({ text }: ErrorProps) => {
  return (
    <div className="flex  py-1 px-3  items-center ring-1 ring-offset-1 ring-orange-400 bg-orange-100 rounded-sm">
      <div className="mr-3">
        <svg
          className="h-5 w-5 text-orange-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
          />
        </svg>
      </div>
      <div>
        <span className="block text-sm text-gray-700">Warning</span>
        <span className="text-gray-500 text-sm">{text}</span>
      </div>
    </div>
  );
};

export default Error;

{
  /* */
}
