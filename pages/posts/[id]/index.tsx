import AvatarSet from "@components/avatarSet";
import Button from "@components/button";
import Error from "@components/errors";
import { FavToggle } from "@components/postItem";
import Layout from "@components/layout";
import { dateFormat } from "@components/postSlider";
import Seperater from "@components/seperater";
import { deliveryFile } from "@libs/client/deliveryFIle";
import useMutation from "@libs/client/mutation";
import { Post } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import FavWithCommentCount from "@components/favWithCommentCount";
import PageNation from "@components/pageNation";
import Comment from "@components/comment";

type AnswerWithFavsCount = {
  answers: number;
  favs: number;
  posts: number;
};

type AnswerData = {
  answer: string | number;
  id: number;
  user: UserInfo;
  createdAt: Date;
};

type UserInfo = {
  email: string;
  avatar: string;
  id: number;
  username: string;
};

interface ElseWithPost extends Post {
  user: UserInfo;
  _count: AnswerWithFavsCount;
  answers: AnswerData[];
}

interface DetailResponse {
  ok: boolean;
  error?: string;
  isMine: boolean;
  seePost: ElseWithPost;
  isLiked: boolean;
}

interface CommentForm {
  comment: string | number;
}

interface AnswerResponse {
  ok: boolean;
  error?: string;
}

type LoggedInUser = {
  me: {
    id: number;
    username: string;
    email: string;
    avatar: string;
  };
};

const initialPage = 1;
const ANSWER_SIZE = 3;
const ItemDetail: NextPage = () => {
  const [answerPage, setAnswerPage] = useState<number>(1);
  const { register, handleSubmit, reset } = useForm<CommentForm>();
  const router = useRouter();
  const { data: loginUser } = useSWR<LoggedInUser>(`/api/users/loginUser`);
  const [togglePost, { loading: togglePostLoading }] = useMutation<FavToggle>(
    `/api/posts/${router.query.id}/fav`
  );

  const { data: detailData, mutate } = useSWR<DetailResponse>(
    router?.query?.id
      ? `/api/posts/${router?.query?.id}?page=${answerPage}`
      : ""
  );

  const [sendAnswer, { data: answersData, loading: answersLoading }] =
    useMutation<AnswerResponse>(`/api/posts/${router.query.id}/answers`);

  const favToggleBtn = () => {
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
              ...prev.seePost?._count,
              favs: prev.isLiked
                ? prev.seePost?._count.favs - 1
                : prev.seePost?._count.favs + 1,
            },
          },
        },
      false
    );
  };

  const pageBack = (isBack: boolean) => {
    isBack === true
      ? setAnswerPage((prev) =>
          prev - initialPage === 0 ? initialPage : prev - initialPage
        )
      : detailData?.seePost.answers &&
        setAnswerPage((prev) =>
          prev > detailData?.seePost.answers.length / ANSWER_SIZE ? 1 : prev + 1
        );
  };

  useEffect(() => {
    if (detailData && !detailData.ok) {
      router.replace("/");
    }
  }, [detailData, router]);

  const onSeeProfile = (id: number) => {
    router.push(`/users/${id}/profile`);
  };

  const onValid = (FormValue: CommentForm) => {
    if (answersLoading) return;
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          seePost: {
            ...prev.seePost,
            answers: [
              ...prev.seePost.answers,
              {
                id: Date.now(),
                answer: FormValue.comment,
                createdAt: dateFormat(new Date()),
                user: { ...loginUser?.me },
              },
            ],
          },
        } as any),
      false
    );
    sendAnswer(FormValue);
  };

  useEffect(() => {
    if (answersData && answersData.ok) {
      reset();
    }
  }, [answersData, reset]);

  return (
    <Layout goBack={true} header="PostDetail">
      <div>{detailData?.error && <Error text="Please log in" />}</div>
      <section className="text-gray-700 px-4 shadow-md">
        <main className="flex flex-col h-[30rem] p-4 space-y-4 rounded-lg ">
          {detailData?.seePost?.user && (
            <div
              onClick={() => onSeeProfile(detailData?.seePost?.user?.id)}
              className="flex cursor-pointer"
            >
              <AvatarSet avatar={detailData?.seePost?.user.avatar} />

              <div>
                <span className="text-xs">
                  {detailData?.seePost?.user?.username}
                </span>
              </div>
            </div>
          )}

          {detailData?.seePost?.image && (
            <div className="relative w-64 h-64 overflow-hidden rounded-lg ">
              <Image
                className=" bg-cover bg-center"
                src={deliveryFile(detailData?.seePost?.image)}
                objectFit="cover"
                layout="fill"
                alt="image"
                quality={100}
                priority
              />
            </div>
          )}

          <div>
            <p className="text-sm mb-10">{detailData?.seePost?.comment}</p>
            <div className="space-y-2">
              {detailData && (
                <FavWithCommentCount
                  _count={detailData?.seePost?._count}
                  favToggleBtn={favToggleBtn}
                  isLiked={detailData.isLiked}
                />
              )}

              <div>
                <span className="text-sm">
                  {detailData?.seePost?.createdAt &&
                    dateFormat(detailData?.seePost?.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </main>
      </section>

      <div className="w-full mt-2 pb-2 px-2">
        <div className="mb-1">
          <span className="text-orange-400">Comment</span>
          <Seperater />
        </div>
        <div className="h-60 mb-4 overflow-y-auto rounded-md">
          {detailData?.seePost?.answers &&
            detailData?.seePost?.answers.map(
              (answer) =>
                router?.query?.id === detailData.seePost.id + "" && (
                  <Comment key={answer.id} {...answer} />
                )
            )}
        </div>

        {detailData?.seePost?._count?.answers &&
        detailData.seePost?._count?.answers > ANSWER_SIZE ? (
          <PageNation pageBack={pageBack} />
        ) : null}

        <form
          onSubmit={handleSubmit(onValid)}
          className="w-full justify-center relative"
        >
          <textarea
            {...register("comment", { required: true })}
            rows={3}
            className="p-1 px-2 rounded-md w-full text-gray-600
            focus:border-orange-300 border-[1px] placeholder:text-sm shadow-md"
            placeholder="Start Comment"
          />
          <Button text="comment" loading={answersLoading} />
        </form>
      </div>
    </Layout>
  );
};

export default ItemDetail;
