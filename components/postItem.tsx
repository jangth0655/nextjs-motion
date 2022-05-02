import { deliveryFile } from "@libs/client/deliveryFIle";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";
import Seperater from "./seperater";
import { useEffect, useState } from "react";
import { cls } from "@libs/client/cls";
import { dateFormat } from "./postSlider";
import AvatarSet from "./avatarSet";
import FavWithCommentCount from "./favWithCommentCount";
import useMutation from "@libs/client/mutation";
import useSWR from "swr";

interface PostList extends Post {
  _count?: {
    answers: number;
    favs: number;
  };
  user?: {
    username?: string;
    avatar?: string;
  };
  isMine?: boolean;
}

export interface FavToggle {
  ok: boolean;
  error?: string;
}

interface RoomConfirm {
  ok: boolean;
  room: {
    id: number;
  };
  error?: string;
}

interface RoomMutation {
  ok: boolean;
  room: {
    id: number;
  };
}

const PostItem = ({
  _count,
  userId,
  comment,
  user,
  id,
  image,
  isMine,
  createdAt,
}: PostList) => {
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [selectUserId, setSelectUserId] = useState<number>();
  const [slideConfig, setSlideConfig] = useState(false);
  const router = useRouter();

  const onSlideConfig = (postId: number) => {
    if (id === postId) {
      setSlideConfig((prev) => !prev);
    }
  };

  const { data: roomConfirm } = useSWR<RoomConfirm>(
    selectUserId ? `/api/chats/userRoom/${selectUserId}` : null
  );

  const [makeRoom, { data, loading: makeRoomLoading }] =
    useMutation<RoomMutation>(`/api/chats?userId=${selectUserId}`);

  const onSeeProfile = (id: number) => {
    router.push(`/users/${id}/profile`);
  };

  const onItemDetail = (id: number) => {
    router.push(`/posts/${id}`);
  };

  const onEditPost = (id: number) => {
    router.push(`/posts/${id}/edit`);
  };

  useEffect(() => {
    roomConfirm ? setLoadingRoom(false) : setLoadingRoom(true);
  }, [roomConfirm]);

  const onChat = (id: number) => {
    userId === id ? setSelectUserId(id) : null;
    console.log(roomConfirm);
    if (selectUserId && roomConfirm && !roomConfirm?.ok) {
      makeRoom(null);
      router.push(`/chats/user/${id}`);
    }
    if (selectUserId && roomConfirm && roomConfirm?.ok) {
      router.push(`/chats/user/${id}`);
    }
  };

  return (
    <>
      <main className="text-gray-700 px-2 snap-y">
        <div className=" border-gray-200 p-2 space-y-8 rounded-lg  -z-10">
          <div className="flex items-center mb-4 justify-between">
            <div className="z-50 flex cursor-pointer relative">
              <div className="z-10" onClick={() => onSlideConfig(id)}>
                <AvatarSet avatar={user?.avatar} />
              </div>

              <div onClick={() => onSlideConfig(id)}>
                <span className="text-xs">{user?.username}</span>
              </div>

              <div
                className={cls(
                  "text-xs w-full bg-orange-300 absolute -bottom-14 z-10 rounded-md text-orange-100 origin-top transition-all",
                  slideConfig ? "scale-y-100" : "scale-y-0 "
                )}
              >
                <div
                  onClick={() => onSeeProfile(userId)}
                  className="h-full px-2 flex flex-col items-center justify-center hover:bg-orange-500 rounded-md py-1"
                >
                  <span>Profile</span>
                </div>
                <div className="h-[1px] w-full bg-orange-100 " />
                <div
                  onClick={() => onChat(userId)}
                  className="h-full px-2 flex flex-col items-center justify-center hover:bg-orange-500 rounded-md py-1 "
                >
                  {makeRoomLoading ? <span>Loading</span> : <span>Chat</span>}
                </div>
              </div>
            </div>

            <div className="flex">
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
              {isMine ? (
                <>
                  <div
                    onClick={() => onEditPost(id)}
                    className="ml-2 text-xs bg-orange-300 px-[2px] rounded-md text-white cursor-pointer hover:bg-orange-500 transition-all flex justify-center items-center"
                  >
                    <span>Edit Post</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {image ? (
            <div className=" relative w-56 h-56 overflow-hidden rounded-lg">
              <Image
                src={deliveryFile(image)}
                className="bg-cover bg-center"
                objectFit="cover"
                layout="fill"
                priority
              />
            </div>
          ) : (
            <div></div>
          )}

          <div className="text-sm">
            <p>{comment}</p>
          </div>

          <div className="space-y-2">
            <FavWithCommentCount _count={_count} />
            <div>
              <span className="text-sm">
                {createdAt && dateFormat(createdAt)}
              </span>
            </div>
          </div>
        </div>
      </main>
      <div className="mb-4">
        <Seperater />
      </div>
    </>
  );
};

export default PostItem;
