import { User } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

interface UserProfile {
  ok: boolean;
  me?: User;
  error: string;
}

export default function useUser() {
  const router = useRouter();
  const { data, error } = useSWR<UserProfile>("/api/users/me");

  /*   useEffect(() => {
    if (data && !data.ok) {
      router.replace("/");
    }
  }, [router, data]); */

  return { ok: data?.ok, userData: data?.me, isLoading: !data && !error };
}
