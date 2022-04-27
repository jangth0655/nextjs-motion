import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
  goBack: boolean;
  title?: string;
}

const Layout = ({ children, goBack = false, title }: LayoutProps) => {
  const { ok } = useUser();

  const router = useRouter();
  const onLogin = () => {
    router.replace("/login");
  };

  const onProfile = () => {
    router.push("/users/profile");
  };

  const onHome = () => {
    router.push("/");
  };

  const canGoBack = () => {
    router.back();
  };

  const onLogout = async () => {
    await (await fetch(`/api/users/logout`)).json();
    router.reload();
  };

  return (
    <section className="h-screen">
      <nav className=" px-4 pt-8 text-sm lg:text-base text-orange-600">
        {goBack ? (
          <>
            <div className="flex justify-around ">
              <div
                onClick={onHome}
                className="cursor-pointer flex items-center "
              >
                <svg
                  className="h-6 w-6 text-orange-300 mr-2  hover:scale-125 hover:transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="uppercase">motion</span>
              </div>
              <div className="flex items-center text-2xl">
                <span>{title}</span>
              </div>
              <div
                onClick={canGoBack}
                className="cursor-pointer flex items-center"
              >
                <div className="flex flex-col items-center">
                  <svg
                    className="h-6 w-6  hover:scale-125 hover:transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
                    />
                  </svg>
                  <span className="uppercase">go Back</span>
                </div>
              </div>
            </div>
          </>
        ) : ok ? (
          <div className="flex items-center justify-between">
            <div onClick={onHome} className="cursor-pointer flex items-center ">
              <svg
                className="h-6 w-6 text-orange-300 mr-2 hover:scale-125 hover:transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <span className="uppercase">motion</span>
            </div>
            <div className="flex items-center text-2xl">
              <span>{title}</span>
            </div>
            <div className="flex lg:space-x-24 space-x-3">
              <div className="flex flex-col items-center cursor-pointer ">
                <svg
                  className="h-5 w-5 text-orange-300 hover:scale-125 hover:transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="">Chat</span>
              </div>
              <div
                onClick={onLogout}
                className="flex flex-col items-center cursor-pointer "
              >
                <svg
                  className="h-5 w-5 text-orange-300 hover:scale-125 hover:transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-sm uppercase">Log out</span>
              </div>
              <div onClick={onProfile} className="px-3 ">
                <div className="flex flex-col items-center cursor-pointer">
                  <svg
                    className="h-5 w-5 text-orange-300 hover:scale-125 hover:transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>username</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-around">
            <div className="cursor-pointer flex items-center">
              <svg
                className="h-6 w-6 text-orange-300 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <span className="uppercase">motion</span>
            </div>
            <div className="flex lg:space-x-24 space-x-4">
              <div
                onClick={onLogin}
                className="flex flex-col items-center cursor-pointer"
              >
                <svg
                  className="h-5 w-5 text-orange-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-sm md:text-base uppercase">login</span>
              </div>
            </div>
          </div>
        )}
        <div className="mt-5 h-[0.5px] w-full bg-orange-200" />
      </nav>
      <main className=" h-screen max-w-2xl m-auto mt-6">{children}</main>
    </section>
  );
};

export default Layout;
