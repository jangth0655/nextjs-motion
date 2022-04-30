import Error from "@components/errors";
import Input from "@components/input";
import Layout from "@components/layout";
import PostList from "@components/postSlider";
import Seperater from "@components/seperater";
import { deliveryFile } from "@libs/client/deliveryFIle";
import { Post, User } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

import useSWR from "swr";

interface ElseWithUser extends User {
  _count: {
    favs: number;
    posts: number;
  };
  posts: Post[];
}

interface UserWithFavAndPostCount {
  ok: boolean;
  error: string;
  me: ElseWithUser;
}

const Profile: NextPage = () => {
  const router = useRouter();

  const { data: userData } = useSWR<UserWithFavAndPostCount>("/api/users/me");
  console.log(userData);

  useEffect(() => {
    if (userData && !userData.ok) {
      router.replace("/");
    }
  }, [userData, router]);

  return (
    <Layout goBack={true}>
      <section className="text-gray-700 p-4">
        {userData?.me.avatar ? (
          <div className=" px-6 flex items-center">
            <div className="flex flex-col items-center mr-4 ">
              <div className="relative w-40 h-40  mb-2 ">
                <Image
                  src={deliveryFile(userData?.me.avatar)}
                  className=" rounded-full  border-dotted  mr-5 flex justify-center items-center"
                  objectFit="cover"
                  layout="fill"
                  alt=""
                  priority={true}
                />
              </div>
              <div className="text-center text-lg ">
                <span>{userData?.me.username}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex p-1 px-2 items-center justify-center bg-orange-300 text-white rounded-lg text-xs cursor-pointer mr-4 hover:bg-orange-500 transition-all">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Edit</span>
              </div>
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
                <span className="block mr-2 text-gray-400">Post_Count</span>
                <span>{userData?.me._count?.posts ?? 0}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="block mr-2 text-gray-400">
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </span>
                <span>{userData?.me.email}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-20 flex items-center w-full h-[30%] ">
            <div className="rounded-full  border-dotted border-2 w-40 h-40 mr-5 flex justify-center items-center border-orange-300 cursor-pointer">
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
            </div>

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
                  className="h-5 w-5 text-gray-500"
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
        <Seperater />
      </section>
    </Layout>
  );
};

export default Profile;
