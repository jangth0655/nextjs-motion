import axios from "axios";
import { NextPage } from "next";
import { useEffect } from "react";

const SeeProfile: NextPage = () => {
  const seeProfile = async () => {
    const response = await axios.get("/api/users/seeProfile/20");
    console.log(response);

    return response.data;
  };
  useEffect(() => {
    seeProfile();
  }, []);
  return <h1></h1>;
};

export default SeeProfile;
