import Layout from "@components/layout";
import PageNation from "@components/pageNation";
import PostItem from "@components/postItem";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { UserPost } from "./profile";

type UserInfo = {
  username?: string;
  avatar?: string;
};

const UserHistory: NextPage = () => {
  const router = useRouter();
  const [postPage, setPostPage] = useState(1);

  const { data: userPostData } = useSWR<UserPost>(
    router.query.id && `/api/posts/${router.query.id}/userPost?page=${postPage}`
  );

  const pageBack = (back: boolean) => {
    back === true
      ? setPostPage((prev) => (prev - 1 === 0 ? 1 : prev - 1))
      : setPostPage((prev) => prev + 1);
  };

  const user: UserInfo = {
    username: userPostData?.userPost.username,
    avatar: userPostData?.userPost?.avatar
      ? userPostData?.userPost?.avatar
      : undefined,
  };

  return (
    <Layout goBack={true}>
      <section>
        {userPostData?.userPost?.posts.map((post) => (
          <PostItem key={post.id} {...post} user={user} />
        ))}
      </section>
      <PageNation pageBack={pageBack} />
    </Layout>
  );
};

export default UserHistory;
