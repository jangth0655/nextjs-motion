/* eslint-disable react-hooks/rules-of-hooks */
import Button from "@components/button";
import Error from "@components/errors";
import Input from "@components/input";
import { NextPage } from "next";
import { useForm } from "react-hook-form";

interface LoginForm {
  username: string;
  email: string;
  error?: string;
}

const login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    mode: "onChange",
  });
  const onValid = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <div className="bg-orange-50 h-screen flex flex-col justify-center items-center">
      <div className=" w-[50%] m-auto">
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
            className="flex flex-col justify-center items-center py-6 px-2 "
          >
            <div className="w-full flex flex-col justify-center items-center space-y-7">
              <div className="flex flex-col space-y-2 lg:w-2/4 w-full">
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
                  lgScreen={true}
                  placeholder="Email"
                />
                {errors?.email?.message && (
                  <Error text={errors.email?.message} />
                )}
              </div>
              <div className="flex flex-col space-y-2 lg:w-2/4  w-full">
                <span className="text-gray-500 block">Username</span>
                <Input
                  register={register("username", {
                    required: "Username is required",
                  })}
                  type="text"
                  lgScreen={true}
                  placeholder="Username"
                />
                {errors?.username?.message && (
                  <Error text={errors.username?.message} />
                )}
              </div>
            </div>
            <Button lgScreen={true} text="sign up" />
          </form>
        </main>
      </div>
    </div>
  );
};

export default login;
