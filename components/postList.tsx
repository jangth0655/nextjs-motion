import { cls } from "@libs/client/cls";
import { Post } from "@prisma/client";
import { useState } from "react";

type PostData = {
  userPost?: Post[];
  postCount?: number;
};

const OFFSET = 1;

export const dateFormat = (date: Date) => {
  return new Date(date).toLocaleDateString("ko");
};

const PostList = ({ userPost, postCount }: PostData) => {
  const [isBack, setIsBack] = useState(false);
  const [page, setPage] = useState(0);
  const onPage = () => {
    console.log(page);

    if (userPost && postCount) {
      const totalPost = postCount - 1;
      const maxPage = Math.floor(totalPost / OFFSET);
      isBack ? "" : setPage((prev) => (prev === maxPage ? 0 : page + 1));
    }
  };

  return (
    <div className="text-gray-700 mt-8  relative ">
      <div className="flex items-center justify-center pb-8  h-80">
        <div className="text-orange-200 w-full flex  justify-between items-center p-4 z-10">
          <svg
            className="h-6 w-6 hover:text-orange-400 cursor-pointer transition-all"
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

          <svg
            onClick={onPage}
            className="h-6 w-6 hover:text-orange-400 cursor-pointer transition-all"
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
        <div className="absolute w-[85%] h-full border-[1px] p-4 rounded-lg border-orange-200">
          {userPost
            ?.slice(OFFSET * page, OFFSET * page + OFFSET)
            .map((post) => (
              <div className="" key={post.id}>
                <div className="flex items-center mb-4">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">
                    {post.createdAt && dateFormat(post.createdAt)}
                  </span>
                </div>
                <div className="h-[50%] bg-orange-300 ">
                  <div className="" />
                </div>
                <div className="h-full">
                  <p>{post.comment}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostList;
