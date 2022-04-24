import Layout from "@components/layout";
import useUser from "@libs/client/useUser";

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface ProfileProps {}

const Profile: NextPage = () => {
  const router = useRouter();
  const { ok, userData } = useUser();

  useEffect(() => {
    if (!ok) {
      router.replace("/");
    }
  }, [ok, router]);
  return (
    <Layout goBack={true}>
      <section>
        <div>
          <div></div>
        </div>
        <div></div>
      </section>
    </Layout>
  );
};

export default Profile;
