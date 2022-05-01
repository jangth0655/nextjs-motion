import { deliveryFile } from "@libs/client/deliveryFIle";
import { Post } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import FavWithCommentCount from "./favWithCommentCount";

type PostData = {
  userPost?: Post[];
  postCount?: number;
  favCount?: number;
  userAvatar?: string | null;
  userName?: string;
};

const OFFSET = 1;

export const dateFormat = (date: Date) => {
  return new Date(date).toLocaleDateString("ko");
};

const PostSlider = ({
  userPost,
  postCount,
  userAvatar,
  userName,
  favCount,
}: PostData) => {
  const router = useRouter();
  const [isBack, setIsBack] = useState(false);
  const [page, setPage] = useState(0);

  const backSlider = (back: boolean) => {
    if (userPost && postCount) {
      const totalPage = postCount && postCount - 1;
      const maxPage = totalPage / OFFSET;
      back === true
        ? setPage((prev) => (prev === 0 ? maxPage : prev - 1))
        : setPage((prev) => (prev === maxPage ? 0 : prev + 1));
    }
  };

  const onItemDetail = (id: number) => {
    router.push(`/posts/${id}`);
  };

  return (
    <div className="text-gray-700 mt-14 relative ">
      <div className="flex items-center justify-center pb-4  h-80">
        <div className="text-orange-200 w-full flex absolute justify-between items-center  z-10">
          <svg
            onClick={() => backSlider(true)}
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
            onClick={() => backSlider(false)}
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
        <div className="absolute w-[80%] h-full  px-4 rounded-lg ">
          {userPost
            ?.slice(page * OFFSET, page * OFFSET + OFFSET)
            .map((post) => (
              <div className="space-y-5" key={post.id}>
                <div className="flex justify-between">
                  <div>
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

                    <div className="flex items-center">
                      {userAvatar ? (
                        <div className="mr-2 relative w-6 h-6 sm:w-8 sm:h-8">
                          <Image
                            src={deliveryFile(userAvatar)}
                            className="bg-slate-100 rounded-full flex justify-center items-center"
                            layout="fill"
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex justify-center items-center border-2 border-orange-200 mr-2">
                          <svg
                            className="h-6 w-6 text-orange-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <span className="text-sm">{userName}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => onItemDetail(post.id)}
                    className="px-2 cursor-pointer group"
                  >
                    <svg
                      className="h-4 w-4 text-gray-500 group-hover:text-orange-400   transition-all"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {post?.image ? (
                  <div className="w-32 h-32 relative overflow-hidden rounded-lg">
                    <Image
                      src={deliveryFile(post.image)}
                      layout="fill"
                      objectFit="cover"
                      priority
                    />
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="h-full">
                  <p>{post.comment}</p>
                </div>
                <FavWithCommentCount
                  favCount={favCount}
                  postCount={postCount}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostSlider;
