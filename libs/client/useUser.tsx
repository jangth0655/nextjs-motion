import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UserProfile {
  ok: boolean;
  error: string;
}

export default function useUser() {
  const router = useRouter();
  const { data, error } = useSWR<UserProfile>("/api/users/me");

  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/");
    }
  }, [router, data]);

  return { ok: data?.ok, userData: data, isLoading: !data && !error };
}
