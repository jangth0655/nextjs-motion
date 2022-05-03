import Layout from "@components/layout";
import PageNation from "@components/pageNation";
import PostItem from "@components/postItem";
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
export const pageSize = 5;

const Home: NextPage = () => {
  const [page, setPage] = useState(1);
  const { data: postsData } = useSWR<PostResponse>(
    `/api/posts/seePosts?page=${page}`
  );

  const router = useRouter();

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
          postsData?.posts?.map((post) => {
            return (
              <PostItem key={post.id} {...post} isMine={postsData.isMine} />
            );
          })}
        {postsData?.posts && postsData?.posts?.length > pageSize ? (
          <PageNation pageBack={pageBack} />
        ) : null}
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
