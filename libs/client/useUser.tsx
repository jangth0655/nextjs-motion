import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UserProfile {
  ok: boolean;
  me: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
  error: string;
}

export default function useUser() {
  const router = useRouter();
  const { data, error } = useSWR<UserProfile>("/api/users/loginUser");

  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/login");
    }
  }, [router, data]);

  return { ok: data?.ok, data: data?.me, isLoading: !data && !error };
}
