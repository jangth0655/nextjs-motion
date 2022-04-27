import { FavToggle } from "@components/homePost";
import Layout from "@components/layout";
import PostList from "@components/postList";
import Seperater from "@components/seperater";
import { cls } from "@libs/client/cls";
import useMutation from "@libs/client/mutation";
import { Post } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ElseWithPost extends Post {
  user: {
    avatar: string;
    id: number;
    usename: string;
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
    router.query.id ? `/api/posts/${router.query.id}` : ""
  );

  const { data: userPostData } = useSWR<UserPost>(
    router.query.id && detailData
      ? `/api/posts/${router.query.id}/userPost?userId=${detailData?.seePost.user.id}`
      : ""
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
              ...prev.seePost._count,
              favs: prev.isLiked
                ? prev.seePost._count.favs - 1
                : prev.seePost._count.favs + 1,
            },
          },
        },
      false
    );
  };

  useEffect(() => {
    if (detailData && !detailData.ok) {
      router.replace("/");
    }
  }, [detailData, router]);

  return (
    <Layout goBack={true}>
      <section className="mt-10 text-gray-700 p-4 ">
        <main className="flex flex-col space-y-10">
          {detailData?.seePost?.image === null ? null : (
            <div className="mb-8 h-48 ">
              <img className="w-full  " />
            </div>
          )}
          <div className="basis-[30%] space-y-5">
            <p className="text-sm">{detailData?.seePost.comment}</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg
                  onClick={() => FavToggleBtn(detailData?.seePost.id)}
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
                  {detailData?.seePost._count.favs}
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
                  {detailData?.seePost._count.answers}
                </span>
              </div>
            </div>
          </div>
          <Seperater />
        </main>
      </section>
      <div className="basis-[70%]">
        {/*  {userPostData?.userPost.posts && (
          <PostList
            userPost={userPostData?.userPost.posts}
            postCount={userPostData.userPost._count.posts}
          />
        )} */}
      </div>
    </Layout>
  );
};

export default ItemDetail;
