import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SeeProfile: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return id ? <h1>{id}</h1> : null;
};

export default SeeProfile;
