import { useState } from "react";

interface MutationState<T> {
  data?: T;
  loading: boolean;
  error?: any;
}

type MutationResponse<T> = [(data: any) => void, MutationState<T>];

const useMutation = <T>(url: string): MutationResponse<T> => {
  const [value, setValue] = useState<MutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  const mutation = async (data: any) => {
    try {
      setValue((prev) => ({ ...prev, loading: true }));
      const response = await (
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
      ).json();
      console.log(response);
      setValue((prev) => ({ ...prev, data: response }));
      if (!response.ok) {
        setValue((prev) => ({ ...prev, error: response.error }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setValue((prev) => ({ ...prev, loading: false }));
    }
  };
  return [mutation, { ...value }];
};

export default useMutation;
