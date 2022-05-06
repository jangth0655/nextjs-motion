import Button from "@components/button";
import Error from "@components/errors";
import Input from "@components/input";
import Layout from "@components/layout";
import { deliveryFile } from "@libs/client/deliveryFIle";
import useMutation from "@libs/client/mutation";
import { Post, User } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";

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

interface FormData {
  email: string;
  username: string;
  avatar: FileList;
  formError?: string;
}

interface EditData {
  ok: boolean;
  editError?: string;
}

const Profile: NextPage = () => {
  const router = useRouter();
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    watch,
  } = useForm<FormData>();
  const [
    editProfile,
    { data: editData, error: editError, loading: editLoading },
  ] = useMutation<EditData>("/api/users/editProfile");

  const { data: userData } = useSWR<UserWithFavAndPostCount>("/api/users/me");

  const onValid = async ({ email, username, avatar }: FormData) => {
    if (editLoading) return;
    if (email === "" && username === "") {
      return setError("formError", {
        message: "Email OR Username are required.",
      });
    }
    if (avatar && avatar.length > 0 && userData?.me.id) {
      const { uploadURL } = await (await fetch("/api/files")).json();

      const form = new FormData();
      form.append("file", avatar[0], userData?.me?.username + "");

      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      editProfile({ email, username, avatarId: id });
    } else {
      editProfile({ email, username });
    }
  };

  useEffect(() => {
    if (editData && editData.ok) {
      router.reload();
    }
  }, [editData, router]);

  useEffect(() => {
    if (userData && !userData.ok) {
      router.replace("/");
    }
  }, [userData, router]);

  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  useEffect(() => {
    userData?.me.email && setValue("email", userData?.me?.email);
    userData?.me.username && setValue("username", userData?.me?.username);
    userData?.me.avatar && setAvatarPreview(deliveryFile(userData.me.avatar));
  }, [
    userData?.me.email,
    userData?.me.username,
    setValue,
    userData?.me.avatar,
  ]);

  const removeAvatar = (id: number) => {
    setDeleteImageLoading(true);
    console.log(deleteImageLoading);
    editProfile({ id });
    setDeleteImageLoading(false);
    console.log(deleteImageLoading);
  };
  return (
    <Layout goBack={true} header="Edit Profile">
      <section className="text-gray-700 p-4">
        {avatarPreview ? (
          <div className=" px-6 flex items-center">
            <div className="mb-10 mr-4 ">
              <div className="relative w-40 h-40  mb-4">
                <Image
                  src={avatarPreview}
                  className=" rounded-full  border-dotted  mr-5 flex justify-center items-center"
                  objectFit="cover"
                  layout="fill"
                  alt=""
                  priority={true}
                />
              </div>
              <div className="flex justify-center">
                <label className="flex p-1 items-center justify-center bg-orange-300 text-white rounded-lg text-xs cursor-pointer mr-4 hover:bg-orange-500 transition-all">
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
                  <input
                    {...register("avatar")}
                    type="file"
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {userData?.me.id && (
                  <div
                    onClick={() => removeAvatar(userData?.me.id)}
                    className="flex text-center p-1 bg-orange-300 text-white rounded-lg text-xs cursor-pointer hover:bg-orange-500 transition-all"
                  >
                    {deleteImageLoading ? "Loading" : <span>Remove</span>}
                  </div>
                )}
              </div>
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
        ) : (
          <div className="px-6 py-20 flex items-center w-full h-[30%] ">
            <label className="rounded-full  border-dotted border-2 w-40 h-40 mr-5 flex justify-center items-center border-orange-300 cursor-pointer">
              <input
                {...register("avatar")}
                type="file"
                className="hidden"
                accept="image/*"
              />
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

        <div>
          <form onSubmit={handleSubmit(onValid)} className="p-4 w-full">
            <div className="space-y-5 w-[100%]">
              <div className="w-full flex items-center">
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

            {errors.formError?.message && (
              <div>
                <Error text={errors.formError?.message} />
              </div>
            )}
            <div className="flex mt-6">
              <Button text="Edit" loading={editLoading} />
            </div>
          </form>
          {editError && (
            <div className="mt-3">{<Error text={editError} />}</div>
          )}
        </div>
      </section>
    </Layout>
  );
};

const SProfile: NextPage<{ me: ElseWithUser }> = (me) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me": {
            ok: true,
            me,
          },
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async (ctx: NextPageContext) => {
    const me = await client.user.findUnique({
      where: {
        id: ctx.req?.session?.user?.id,
      },
      select: {
        avatar: true,
        username: true,
        id: true,
        email: true,
        _count: {
          select: {
            favs: true,
            posts: true,
          },
        },
      },
    });
    return {
      props: {
        me: JSON.parse(JSON.stringify(me)),
      },
    };
  }
);

export default SProfile;
