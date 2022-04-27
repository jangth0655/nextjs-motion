import { deliveryFile } from "@libs/client/deliveryFIle";
import useMutation from "@libs/client/mutation";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

interface HomePost extends Post {
  _count: {
    answers: number;
    favs: number;
  };
  user: {
    username: string;
    avatar?: string;
  };
}

export interface FavToggle {
  ok: boolean;
  error?: string;
}

const HomePost = ({ _count, userId, comment, user, id, image }: HomePost) => {
  const router = useRouter();
  const [togglePost] = useMutation<FavToggle>(`/api/posts/${id}/fav`);
  const { mutate: unboundTogglePost } = useSWRConfig();
  const onSeeProfile = (id: number) => {
    router.push(`/users/${id}/profile`);
  };

  const onItemDetail = (id: number) => {
    router.push(`/posts/${id}`);
  };

  const FavToggleBtn = (id: number) => {
    togglePost({});
    unboundTogglePost("/api/posts/seePosts");
  };

  return (
    <main className="mt-10 text-gray-700 p-4">
      <div className="border-[0.5px] border-gray-200 p-4 space-y-2 rounded-lg ">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex cursor-pointer">
            {user.avatar ? (
              <div className="mr-2 ">
                <img
                  onClick={() => onSeeProfile(userId)}
                  src={deliveryFile(user.avatar)}
                  className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-400 rounded-full flex justify-center items-center"
                />
              </div>
            ) : (
              <div
                onClick={() => onSeeProfile(userId)}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex justify-center items-center border-2 border-orange-200 mr-2"
              >
                <svg
                  className="h-6 w-6 text-orange-300"
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
              </div>
            )}

            <div onClick={() => onSeeProfile(userId)}>
              <span className="text-xs">{user.username}</span>
            </div>
          </div>
          <div
            onClick={() => onItemDetail(id)}
            className="px-2 cursor-pointer group"
          >
            <svg
              className="h-4 w-4 text-gray-500 group-hover:text-orange-400   transition-all"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {image ? (
          <div className="">
            <img className="" />
          </div>
        ) : null}
        <div className="text-sm">
          <p>{comment}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg
              onClick={() => FavToggleBtn(id)}
              className="h-4 w-4 text-gray-400 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm">{_count.favs}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{_count.answers}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePost;
