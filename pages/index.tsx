import Layout from "@components/layout";
import PostList from "@components/postList";
import { Post } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

interface ResultsElseWithPost extends Post {
  user: {
    username: string;
    avatar?: string;
  };
  _count: {
    answers: number;
    favs: number;
  };
}

interface PostResponse {
  ok: boolean;
  posts: ResultsElseWithPost[];
  postCount: number;
  isMine: boolean;
  error?: string;
}

const initialPage = 1;

const Home: NextPage = () => {
  const [page, setPage] = useState(1);
  const { data: postsData } = useSWR<PostResponse>(
    `/api/posts/seePosts?page=${page}`
  );
  const router = useRouter();

  console.log(page);

  const onUpload = () => {
    router.push("/posts/upload");
  };

  const pageBack = (isBack: boolean) => {
    isBack === true
      ? setPage((prev) =>
          prev - initialPage === 0 ? initialPage : prev - initialPage
        )
      : setPage((prev) => prev + initialPage);
  };

  return (
    <>
      <Layout goBack={false}>
        {postsData &&
          postsData?.posts
            ?.map((post) => {
              return (
                <PostList key={post.id} {...post} isMine={postsData.isMine} />
              );
            })
            .reverse()}
        <div className="flex w-full justify-center space-x-2 pb-2">
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
        </div>
      </Layout>
      <div
        onClick={onUpload}
        className="fixed bottom-8 right-6 w-8 h-8 sm:w-12 sm:h-12 bg-orange-400 rounded-full flex justify-center items-center cursor-pointer"
      >
        <svg
          className="h-6 w-6 sm:w-8 sm:h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
    </>
  );
};

export default Home;
