import Layout from "@components/layout";
import useMutation from "@libs/client/mutation";
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

  console.log(postsData);

  return (
    <Layout goBack={false}>
      {postsData?.posts.map((post) => (
        <main key={post.id} className="mt-10 text-gray-700 p-4 h-screen">
          <div className="border-[0.5px] border-orange-300 p-4 space-y-6">
            <div className="flex items-center mb-4">
              <div className="mr-2">
                <img className="w-8 h-8 bg-slate-400 rounded-full" />
              </div>
              <div>
                <span className="text-xs">{post.user.username}</span>
              </div>
            </div>
            <div className="h-full">
              <img className="w-full h-40 bg-orange-200" />
            </div>
            <div className="text-sm">
              <p>{post.comment}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-6 w-6"
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
                <span>{post._count.favs}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{post._count.answers}</span>
              </div>
            </div>
          </div>
        </main>
      ))}
      <div
        onClick={onUpload}
        className="fixed bottom-8 right-6 w-12 h-12 bg-orange-400 rounded-full flex justify-center items-center cursor-pointer"
      >
        <svg
          className="h-10 w-10 text-white"
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
    </Layout>
  );
};

export default Home;
