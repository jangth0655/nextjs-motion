import Error from "@components/errors";
import Input from "@components/input";
import Layout from "@components/layout";
import useMutation from "@libs/client/mutation";
import useUser from "@libs/client/useUser";
import { Post, User } from "@prisma/client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface FavAndPostCount extends User {
  _count: {
    favs: number;
    posts: number;
  };
}

interface UserWithFavAndPostCount {
  ok: boolean;
  error: string;
  me: FavAndPostCount;
}

interface FormData {
  email: string;
  username: string;
}

interface EditData {
  ok: boolean;
  editError?: string;
}

interface PostResponse {
  ok: boolean;
  postCount: number;
  posts: Post[];
  _count: {
    answers: number;
    favs: number;
  };
}

const Profile: NextPage = () => {
  useUser();
  const [page, setPage] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [editProfile, { data: editData, error: editError }] =
    useMutation<EditData>("/api/users/editProfile");

  const { data: userData, mutate } =
    useSWR<UserWithFavAndPostCount>("/api/users/me");

  const { data: postData, error: postError } = useSWR<PostResponse>(
    "/api/posts/seePosts?page=1"
  );

  const onValid = (formData: FormData) => {
    editProfile(formData);
  };

  const OFFSET = 3;

  const onPage = () => {
    console.log(1);
    if (postData) {
      const totalPost = postData.postCount;
      const maxPage = Math.floor(totalPost / OFFSET);
      setPage((prev) => (prev === maxPage ? 0 : page + 1));
    }
  };

  console.log(page);

  useEffect(() => {
    userData?.me.email && setValue("email", userData.me.email);
    userData?.me.username && setValue("username", userData.me.username);
  }, [userData?.me.email, userData?.me.username, setValue]);

  return (
    <Layout goBack={true}>
      <section className="h-full text-gray-700 relative">
        {userData?.me?.avatar ? (
          userData?.me.avatar
        ) : (
          <div className="px-6 py-20 flex items-center w-full h-[30%] ">
            <label className="rounded-full  border-dotted border-2 w-40 h-40 mr-5 flex justify-center items-center border-orange-300 cursor-pointer">
              <input type="file" className="hidden" accept="image/*" />
              <svg
                className="h-16 w-16 text-orange-400 z-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-pink-500 mr-2 "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-400">
                  {userData?.me._count?.favs ?? 0}
                </span>
              </div>

              <div className="flex items-center cursor-pointer">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2 "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-400">Chat</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="block mr-2 text-gray-400">Poster</span>
                <span>{userData?.me._count?.posts ?? 0}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <form
            onSubmit={handleSubmit(onValid)}
            className="p-4 w-full  flex items-center"
          >
            <div className="space-y-5 w-[80%]">
              <div className="w-full flex items-center ">
                <div className="w-24 mr-3 flex justify-center">
                  <svg
                    className="h-6 w-6 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>

                <div className="w-full">
                  <Input register={register("email")} type="text" />
                </div>
              </div>
              <div className="w-full flex items-center ">
                <div className="w-24 mr-3 flex justify-center">
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
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <Input register={register("username")} type="text" />
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center m-auto py-2">
              <button className="py-1 px-5 hover:text-orange-600  hover:transition-all text-orange-400">
                <svg
                  className="h-6 w-6 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          </form>
          {editError && (
            <div className="mt-3">{<Error text={editError} />}</div>
          )}
        </div>

        <div className="h-[30%] grid grid-cols-3  absolute w-full ">
          {postData?.posts
            .slice(OFFSET * page, OFFSET * page + OFFSET)
            .map((post) => (
              <div
                key={post.id}
                className="border-orange-300 border-2 w-full p-1 "
              >
                comment : {post.comment}
              </div>
            ))}
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
