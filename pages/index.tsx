import HomePost from "@components/homePost";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { Post } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
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
  error?: string;
}

const Home: NextPage = () => {
  const { data: postsData } = useSWR<PostResponse>("/api/posts/seePosts");
  const router = useRouter();

  const onUpload = () => {
    router.push("/posts/upload");
  };

  return (
    <>
      <Layout goBack={false}>
        {postsData &&
          postsData?.posts?.map((post) => {
            return <HomePost key={post.id} {...post} />;
          })}
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
