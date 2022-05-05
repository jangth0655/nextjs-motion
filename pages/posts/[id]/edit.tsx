import Button from "@components/button";
import Error from "@components/errors";
import Layout from "@components/layout";
import { deliveryFile } from "@libs/client/deliveryFIle";
import useMutation from "@libs/client/mutation";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface EditForm {
  comment: string;
  image: FileList;
}

interface EditPostResponse {
  ok: boolean;
  error?: string;
}

interface PostContent {
  ok: boolean;
  postContent: {
    comment: string;
    image: string;
    id: number;
  };
}

interface RemovePost {
  ok: true;
  error?: string;
}

const UploadPost: NextPage = () => {
  const [imagePreview, setImagePreview] = useState("");
  const router = useRouter();
  const [editPost, { data: editData, loading: editLoading, error }] =
    useMutation<EditPostResponse>(`/api/posts/${router.query?.id}`);
  const { data: postPreview } = useSWR<PostContent>(
    router.query?.id && `/api/posts/${router.query?.id}?post=content`
  );

  const [removeItem, { data: removeData, loading: removeLoading }] =
    useMutation<RemovePost>(`/api/posts/${router.query.id}/removePost`);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EditForm>();

  const onValid = async ({ comment, image }: EditForm) => {
    if (editLoading) return;
    if (image && image.length > 0) {
      const { uploadURL } = await (await fetch("/api/files")).json();
      const form = new FormData();
      form.append("file", image[0]);
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      editPost({ comment, imageId: id });
    } else {
      editPost({ comment });
    }
  };

  const onRemovePost = (id: number) => {
    removeItem(id);
  };

  const image = watch("image");
  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  useEffect(() => {
    if (!postPreview) return;
    postPreview?.postContent?.comment &&
      setValue("comment", postPreview?.postContent?.comment);
    postPreview?.postContent?.image &&
      setImagePreview(deliveryFile(postPreview?.postContent?.image));
  }, [postPreview, setValue]);

  useEffect(() => {
    if ((editData && editData.ok) || (removeData && removeData.ok)) {
      router.push("/");
    }
  }, [editData, removeData, router]);

  return (
    <Layout goBack={true} title="Create Post" header="Edit">
      <form
        onSubmit={handleSubmit(onValid)}
        className="h-screen text-gray-700 space-y-10 mt-16 p-4"
      >
        {imagePreview ? (
          <label className="h-[30%] flex justify-center items-center ">
            <div className="relative w-full h-full overflow-hidden rounded-md">
              <Image
                src={imagePreview}
                className="bg-cover bg-center cursor-pointer"
                layout="fill"
                objectFit="contain"
                alt=""
                priority
              />
            </div>
            <input
              {...register("image")}
              className="hidden"
              type="file"
              id="image"
              accept="image/*"
            />
          </label>
        ) : (
          <div className="h-[30%] border-dashed border-orange-500 border-[1px] rounded-md">
            <label
              htmlFor="image"
              className="cursor-pointer text-center m-auto w-full h-full  flex justify-center items-center"
            >
              <input
                {...register("image")}
                className="hidden"
                type="file"
                id="image"
                accept="image/*"
              />
              <svg
                className="h-16 w-16 text-orange-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </div>
        )}
        <div className="">
          <div className="w-full text-sm">
            <div className="items-center">
              <label
                htmlFor="comment"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                <div className="flex px-2">
                  <svg
                    className="h-6 w-6 text-orange-300 mr-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    />
                  </svg>
                  <div>
                    <span className="text-orange-400 font-bold">Comment</span>
                  </div>
                </div>
              </label>
              <textarea
                {...register("comment", { required: "Comment is required" })}
                className="w-full p-4 rounded-lg text-gray-700 shadow-sm border-2 border-orange-200 hover:transition-all hover:border-orange-400 placeholder:uppercase"
                id="comment"
                placeholder="Comment..."
                rows={4}
              />
            </div>
            {errors?.comment?.message && (
              <div className="mt-2">
                <Error text={errors?.comment?.message} />
              </div>
            )}
            <div className=" mt-10">
              <Button text="edit" loading={editLoading} />
            </div>

            {removeLoading
              ? "Loading :)"
              : postPreview?.postContent?.id && (
                  <div className="flex  items-center mt-5 text-pink-200">
                    <span
                      onClick={() => onRemovePost(postPreview?.postContent.id)}
                      className="flex items-center px-2 cursor-pointer hover:bg-pink-600 hover:text-white font-bold transition-all border-2 border-pink-200 rounded-md"
                    >
                      Delete Post
                      <svg
                        className="ml-1 h-8 w-8 "
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                )}
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default UploadPost;
