import { FavToggle } from "@components/homePost";
import Layout from "@components/layout";
import Seperater from "@components/seperater";
import { cls } from "@libs/client/cls";
import { deliveryFile } from "@libs/client/deliveryFIle";
import useMutation from "@libs/client/mutation";
import { Post } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ElseWithPost extends Post {
  user: {
    avatar: string;
    id: number;
    username: string;
  };
  _count: {
    answers: number;
    favs: number;
  };
}

interface DetailResponse {
  ok: boolean;
  isMine: boolean;
  seePost: ElseWithPost;
  isLiked: boolean;
}

interface UserPost {
  ok: boolean;
  userPost: {
    posts: Post[];
    _count: {
      posts: number;
    };
  };
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const [togglePost, { loading: togglePostLoading }] = useMutation<FavToggle>(
    `/api/posts/${router.query.id}/fav`
  );

  const { data: detailData, mutate } = useSWR<DetailResponse>(
    router?.query?.id ? `/api/posts/${router?.query?.id}` : ""
  );

  const FavToggleBtn = (id?: number) => {
    if (togglePostLoading) return;
    if (!detailData) return;
    togglePost({});
    mutate(
      (prev) =>
        prev && {
          ...prev,
          isLiked: !prev.isLiked,
          seePost: {
            ...prev.seePost,
            _count: {
              ...prev.seePost?._count,
              favs: prev.isLiked
                ? prev.seePost?._count.favs - 1
                : prev.seePost?._count.favs + 1,
            },
          },
        },
      false
    );
  };

  const onSeeProfile = (id: number) => {
    router.push(`/users/${id}/profile`);
  };

  return (
    <Layout goBack={true}>
      <section className="mt-10 text-gray-700 p-4 ">
        <main className="flex flex-col h-[30rem]  p-4 space-y-8 rounded-lg ">
          {detailData?.seePost.user && (
            <div
              onClick={() => onSeeProfile(detailData?.seePost?.user?.id)}
              className="flex cursor-pointer"
            >
              {detailData?.seePost?.user.avatar ? (
                <div className="mr-2 relative w-6 h-6 sm:w-8 sm:h-8">
                  <Image
                    src={deliveryFile(detailData?.seePost?.user?.avatar)}
                    className="bg-slate-100 rounded-full flex justify-center items-center"
                    layout="fill"
                    alt=""
                    priority
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
                <span className="text-xs">
                  {detailData?.seePost?.user?.username}
                </span>
              </div>
            </div>
          )}

          {detailData?.seePost?.image && (
            <div className="relative w-80 h-80 overflow-hidden rounded-lg  border-2">
              <Image
                className=" bg-cover bg-center"
                src={deliveryFile(detailData?.seePost?.image)}
                objectFit="cover"
                layout="fill"
                alt="image"
                quality={100}
                priority
              />
            </div>
          )}

          <div className="space-y-5">
            <p className="text-sm">{detailData?.seePost?.comment}</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg
                  onClick={() => FavToggleBtn(detailData?.seePost?.id)}
                  className={cls(
                    "h-4 w-4  cursor-pointer",
                    detailData?.isLiked ? "text-pink-500" : "text-gray-400"
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
                <span className="text-sm">
                  {detailData?.seePost?._count.favs}
                </span>
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
                <span className="text-sm">
                  {detailData?.seePost?._count.answers}
                </span>
              </div>
            </div>
          </div>
        </main>
      </section>
      <Seperater />
      <div className="mt-6 p-4">asdf</div>
    </Layout>
  );
};

export default ItemDetail;
