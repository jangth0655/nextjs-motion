/* eslint-disable react-hooks/rules-of-hooks */
import Button from "@components/button";
import Error from "@components/errors";
import Input from "@components/input";
import useMutation from "@libs/client/mutation";

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface LoginMutationRes {
  ok: boolean;
  [key: string]: any;
  error: string;
}

interface LoginForm {
  email: string;
  username: string;
}

const login: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();
  const [
    loginMutation,
    { data: loginData, loading: loginLoading, error: loginError },
  ] = useMutation<LoginMutationRes>("/api/users/login");

  const onValid = (formValue: LoginForm) => {
    loginMutation(formValue);
  };

  useEffect(() => {
    if (loginData && loginData?.ok) {
      router.push("/");
    }
  }, [loginData, router]);

  const onClick = () => {
    router.replace("/enter");
  };

  return (
    <div className="bg-orange-50 h-screen px-8 flex flex-col justify-center items-center">
      <div className=" max-w-lg w-full m-auto">
        <header className="text-center">
          <h1 className="text-orange-500 px-2 uppercase text-[2rem] font-bold tracking-wider">
            Motion
          </h1>
          <h3 className="text-orange-500 px-2 uppercase text-lg font-bold ">
            Login
          </h3>
        </header>
        <main className="mt-10">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col justify-center items-center py-6"
          >
            <div className="w-full flex flex-col justify-center items-center space-y-7">
              <div className="flex flex-col space-y-2  w-full">
                <span className="text-gray-500 block">Email</span>
                <Input
                  register={register("email")}
                  type="text"
                  lgScreen={true}
                  placeholder="Email"
                />
              </div>
              <div className="flex flex-col space-y-2   w-full">
                <span className="text-gray-500 block">Username</span>
                <Input
                  register={register("username")}
                  type="text"
                  lgScreen={true}
                  placeholder="Username"
                />
              </div>
            </div>
            <div className="w-full mt-10 text-center">
              <Button loading={loginLoading} lgScreen={true} text="Login" />
            </div>
          </form>
          <div className="text-center w-full ">
            <Button onClick={onClick} lgScreen={true} text="go sign up" />
          </div>
          {loginError && (
            <div className="mt-5">
              <Error text={loginData?.error} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default login;
