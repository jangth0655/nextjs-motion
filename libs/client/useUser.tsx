import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface UserProfile {
  ok: boolean;
  me?: User;
}

export default function useUser() {
  const [loginUser, setLoginUser] = useState<UserProfile>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get<UserProfile>("/api/users/me");
      setLoginUser(data);
      if (!data || !data?.ok) {
        router.replace("/");
      }
      return data;
    })();
  }, [router]);

  return { loginUser: loginUser?.ok, meProfile: loginUser?.me };
}
