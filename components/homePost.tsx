import { deliveryFile } from "@libs/client/deliveryFIle";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";
import Seperater from "./seperater";
import { useState } from "react";
import { cls } from "@libs/client/cls";
import { setConfig } from "next/config";

interface HomePost extends Post {
  _count: {
    answers: number;
    favs: number;
  };
  user: {
    username: string;
    avatar?: string;
  };
  isMine: boolean;
}

export interface FavToggle {
  ok: boolean;
  error?: string;
}

const HomePost = ({
  _count,
  userId,
  comment,
  user,
  id,
  image,
  isMine,
}: HomePost) => {
  const [slideConfig, setSlideConfig] = useState(false);
  const router = useRouter();

  const onSlideConfig = (postId: number) => {
    if (id === postId) {
      setSlideConfig((prev) => !prev);
    }
  };

  const onSeeProfile = (id: number) => {
    router.push(`/users/${id}/profile`);
  };

  const onItemDetail = (id: number) => {
    router.push(`/posts/${id}`);
  };

  const onEditPost = (id: number) => {
    router.push(`/posts/${id}/edit`);
  };

  return (
    <>
      <main className="text-gray-700 p-4 snap-y -z-10">
        <div className=" border-gray-200 p-4 space-y-8 rounded-lg ">
          <div className="flex items-center mb-4 justify-between">
            <div className="flex cursor-pointer relative">
              <div className="z-10" onClick={() => onSlideConfig(id)}>
                {user.avatar ? (
                  <div className="mr-2 relative w-6 h-6 sm:w-8 sm:h-8">
                    <Image
                      src={deliveryFile(user.avatar)}
                      className="bg-slate-100 rounded-full flex justify-center items-center"
                      layout="fill"
                      alt=""
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => onSeeProfile(userId)}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex justify-center items-center border-2 border-orange-200 mr-2"
                  >
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
              </div>

              <div onClick={() => onSlideConfig(id)}>
                <span className="text-xs">{user.username}</span>
              </div>

              <div
                className={cls(
                  "text-xs w-full bg-orange-300 absolute -bottom-14 z-10 rounded-md text-orange-100 origin-top transition-all",
                  slideConfig ? "scale-y-100" : "scale-y-0 "
                )}
              >
                <div
                  onClick={() => onSeeProfile(userId)}
                  className="h-full px-2 flex flex-col items-center justify-center hover:bg-orange-400 rounded-md py-1"
                >
                  <span>Profile</span>
                </div>
                <div className="h-[1px] w-full bg-orange-100 " />
                <div className="h-full px-2 flex flex-col items-center justify-center hover:bg-orange-400 rounded-md py-1">
                  <span>Chat</span>
                </div>
              </div>
            </div>

            <div className="flex">
              <div
                onClick={() => onItemDetail(id)}
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
              {isMine ? (
                <>
                  <div
                    onClick={() => onEditPost(id)}
                    className="ml-2 text-xs bg-orange-300 px-[2px] rounded-md text-white cursor-pointer hover:bg-orange-500 transition-all flex justify-center items-center"
                  >
                    <span>Edit Post</span>
                  </div>
                  <div
                    onClick={() => onEditPost(id)}
                    className="ml-2 text-xs p-[2.5px] rounded-md text-pink-300 cursor-pointer hover:text-pink-500 transition-all"
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {image ? (
            <div className="relative w-80 h-80 overflow-hidden rounded-lg">
              <Image
                src={deliveryFile(image)}
                className="bg-cover bg-center"
                objectFit="cover"
                layout="fill"
                alt=""
                quality={100}
              />
            </div>
          ) : (
            <div></div>
          )}

          <div className="text-sm">
            <p>{comment}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg
                className="h-4 w-4 text-gray-400 cursor-pointer"
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
              <span className="text-sm">{_count.favs}</span>
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
              <span className="text-sm">{_count.answers}</span>
            </div>
          </div>
        </div>
      </main>
      <Seperater />
    </>
  );
};

export default HomePost;
