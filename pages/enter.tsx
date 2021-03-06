/* eslint-disable react-hooks/rules-of-hooks */
import Button from "@components/button";
import Error from "@components/errors";
import Input from "@components/input";
import useMutation from "@libs/client/mutation";
import { Token } from "@prisma/client";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EnterForm {
  username: string;
  email: string;
  error?: string;
}

interface ConfirmToken {
  token?: string;
}

interface EnterMutation {
  ok: boolean;
  error: string;
  token: Token;
}

interface TokenMutation {
  ok: boolean;
  [key: string]: any;
}

const login: NextPage = () => {
  const router = useRouter();
  const [
    enterMutation,
    { data: enterData, loading: enterLoading, error: enterError },
  ] = useMutation<EnterMutation>("/api/users/enter");
  const [
    tokenMutation,
    { data: tokenData, loading: tokenLoading, error: tokenErrors },
  ] = useMutation<TokenMutation>("/api/users/confirm");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<EnterForm>({
    mode: "onChange",
  });
  const {
    register: tokenRegister,
    handleSubmit: tokenHandleSubmit,
    formState: { errors: formTokenErrors },
  } = useForm<ConfirmToken>();

  const onValid = async (formValue: EnterForm) => {
    if (enterLoading) return;
    enterMutation(formValue);
  };

  const onValidToken = async (tokenValue: ConfirmToken) => {
    if (tokenLoading) return;
    tokenMutation(tokenValue);
  };

  useEffect(() => {
    if (tokenData?.ok) {
      router.push("/");
    }
  }, [router, tokenData]);

  const onClick = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>SignUp</title>
      </Head>
      {enterData?.ok ? (
        <div className="bg-orange-50 h-screen fle px-8 flex-col justify-center items-center">
          <div className=" max-w-lg w-full m-auto">
            <div className="text-center">
              <h1 className="text-orange-500 px-2 uppercase text-[2rem] font-bold tracking-wider">
                Motion
              </h1>
              <h3 className="text-orange-500 px-2 uppercase text-lg font-bold ">
                Log In
              </h3>
            </div>
            <form className="mt-10 " onSubmit={tokenHandleSubmit(onValidToken)}>
              <Input
                register={tokenRegister("token", {
                  required: "Token is required!",
                })}
                type="text"
                placeholder="Write a Token"
              />
              {enterData?.token && (
                <div className="border-2 border-orange-300 mt-4 rounded-md p-2">
                  <span className=" text-orange-500 text-sm">
                    Token: {enterData?.token.payload}
                  </span>
                </div>
              )}
              <div className="text-center w-full mt-5">
                <Button text="Confirm" loading={tokenLoading} />
              </div>
            </form>
            {formTokenErrors.token?.message && (
              <Error text={formTokenErrors.token.message} />
            )}
            {tokenErrors && (
              <div className="mt-10 w-full">{<Error text={tokenErrors} />}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="px-8  bg-orange-50 h-screen flex flex-col justify-center items-center">
          <div className=" max-w-lg w-full ">
            <header className="text-center">
              <h1 className="text-orange-500 px-2 uppercase text-[2rem] font-bold tracking-wider">
                Motion
              </h1>
              <h3 className="text-orange-500 px-2 uppercase text-lg font-bold ">
                sign up
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
                      register={register("email", {
                        required: "Email is required",
                        validate: {
                          emailForm: (value) =>
                            value.includes("@") || "Plz write email form",
                        },
                      })}
                      type="text"
                      placeholder="Email"
                    />
                    {errors?.email?.message && (
                      <Error text={errors.email?.message} />
                    )}
                  </div>
                  <div className="flex flex-col space-y-2  w-full">
                    <span className="text-gray-500 block">Username</span>
                    <Input
                      register={register("username", {
                        required: "Username is required",
                      })}
                      type="text"
                      placeholder="Username"
                    />
                    {errors?.username?.message && (
                      <Error text={errors.username?.message} />
                    )}
                  </div>
                </div>
                <div className="w-full mt-10 text-center">
                  <Button loading={enterLoading} text="sign up" />
                </div>
                {enterError && (
                  <div className="mt-8 w-full">
                    <Error text={enterError} />
                  </div>
                )}
              </form>
              <div className="text-center">
                <Button onClick={onClick} text="go log in" />
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default login;
