import { cls } from "@libs/client/cls";

interface FavWithCommentCountProps {
  favToggleBtn?: () => void;
  isLiked?: boolean;
  _count?: {
    favs?: number;
    answers?: number;
  };
  favCount?: number;
  postCount?: number;
}

const FavWithCommentCount = ({
  _count,
  favToggleBtn,
  isLiked,
  favCount,
  postCount,
}: FavWithCommentCountProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {favToggleBtn ? (
          <svg
            onClick={() => favToggleBtn()}
            className={cls(
              "h-4 w-4  cursor-pointer text-pink-400",
              isLiked ? "text-pink-600" : "text-gray-400"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        ) : (
          <svg
            className={cls(
              "h-4 w-4  cursor-pointer text-pink-400",
              isLiked ? "text-pink-600" : "text-gray-400"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
        <span className="text-sm">{_count?.favs || favCount}</span>
      </div>
      <div className="flex items-center space-x-2">
        <svg
          className="h-4 w-4 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm">{_count?.answers || postCount}</span>
      </div>
    </div>
  );
};

export default FavWithCommentCount;
