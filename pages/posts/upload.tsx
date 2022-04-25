import Button from "@components/button";
import Error from "@components/errors";
import Layout from "@components/layout";
import useMutation from "@libs/client/mutation";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UploadForm {
  comment: string;
  image?: string;
}

interface UploadResponsive {
  ok: boolean;
  error?: string;
}

const UploadPost: NextPage = () => {
  const router = useRouter();
  const [createPost, { data: createData, loading: createLoading, error }] =
    useMutation<UploadResponsive>("/api/posts");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadForm>();

  const onValid = (data: UploadForm) => {
    if (createLoading) return;
    createPost(data);
  };

  useEffect(() => {
    if (createData && createData.ok) {
      router.push("/");
    }
  }, [createData, router]);
  return (
    <Layout goBack={true} title="Create Post">
      <form
        onSubmit={handleSubmit(onValid)}
        className="h-screen text-gray-700 space-y-10 mt-16 p-4"
      >
        <div className="h-[30%] border-dashed border-orange-500 border-[1px] ">
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
              <Button text="Create" loading={createLoading} />
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default UploadPost;
