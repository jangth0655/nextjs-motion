import Button from "@components/button";
import Comment from "@components/comment";
import Layout from "@components/layout";
import PageNation from "@components/pageNation";
import { dateFormat } from "@components/postSlider";
import useMutation from "@libs/client/mutation";
import useUser from "@libs/client/useUser";
import { Chat, User } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface RoomId {
  ok: boolean;
  room: {
    id: number;
  };
}

interface ChatForm {
  payload: string | number | any;
}

interface ChatMutation {
  ok: boolean;
  chat: Chat;
  error?: string;
  myChat: boolean;
}

interface ChatWithRoom extends Chat {
  user: User;
}

export interface RoomData {
  ok: boolean;
  id: number;
  room: {
    _count: { chats: number };
    chats: ChatWithRoom[];
    error?: string;
    users: {
      avatar: string;
      id: number;
      username: string;
    }[];
  };
}

interface LastChat {
  ok: boolean;
  lastChatUserId: number;
}

interface ConfirmRoomUpdate {
  ok: boolean;
  readingChat: {
    id: number;
    read: boolean;
  };
}

const initialPage = 1;
const CHAT_SIZE = 10;
const Chat: NextPage = () => {
  const router = useRouter();

  const loggedInUser = useUser();
  const { register, handleSubmit, reset } = useForm<ChatForm>();
  const [chatPage, setChatPage] = useState<number>(1);

  const { data: currentRoom } = useSWR<RoomId>(
    router.query.id && `/api/chats/userRoom/${router.query.id}`
  );

  const [sendMessage, { data: chatData, loading: chatLoading }] =
    useMutation<ChatMutation>(
      currentRoom?.room?.id && router.query?.id
        ? `/api/chats?roomId=${currentRoom?.room?.id}&userId=${router.query?.id}`
        : ""
    );

  const { data: chatList } = useSWR<LastChat>(
    currentRoom?.room?.id && chatData
      ? `/api/chats/seeChat/${currentRoom?.room.id}`
      : ""
  );

  const { data: roomData, mutate: boundMutate } = useSWR<RoomData>(
    currentRoom?.room?.id
      ? `/api/chats/seeRoom/${currentRoom?.room?.id}?page=${chatPage}`
      : null,
    {
      refreshInterval: 1000,
    }
  );

  const [roomUpdate, { data: roomUpdateData }] = useMutation<ConfirmRoomUpdate>(
    currentRoom?.room.id ? `/api/chats/seeRoom/${currentRoom?.room?.id}` : ""
  );

  useEffect(() => {
    if (chatData && chatData.ok) {
      roomUpdate({ lastSendUserId: chatData.chat.userId });
    }
  }, [chatData]);

  useEffect(() => {
    if (chatList && chatList?.ok && router.query.loggedInUserId) {
      roomUpdate({ lastChatUserId: chatList.lastChatUserId });
    }
  }, [chatList]);

  useEffect(() => {
    if (roomData) {
      const enterUser = roomData?.room?.users.map((user) => user.id);
      const enterOk =
        loggedInUser?.data?.id && enterUser?.includes(loggedInUser?.data?.id);
      if (!enterOk) {
        router.replace("/");
      }
    }
  }, [
    roomData?.room?.users,
    loggedInUser,
    router,
    roomData,
    currentRoom?.room?.id,
  ]);

  const onValid = (chatPayload: ChatForm) => {
    if (chatLoading) return;
    boundMutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          room: {
            ...prev.room,
            chats: [
              ...prev.room.chats,
              {
                id: Date.now(),
                payload: chatPayload.payload,
                createdAt: dateFormat(new Date()),
                user: { ...loggedInUser.data },
              },
            ],
          },
        } as any),
      false
    );
    sendMessage(chatPayload);
    reset();
  };

  const pageBack = (isBack: boolean) => {
    isBack === true
      ? setChatPage((prev) =>
          prev - initialPage === 0 ? initialPage : prev - 1
        )
      : roomData?.room?.chats.length &&
        setChatPage((prev) =>
          prev > roomData?.room?._count.chats / CHAT_SIZE ? 1 : prev + 1
        );
  };

  return (
    <Layout goBack={true} header="Chat">
      <main className="p-2 space-y-4 ">
        <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
        <div className="h-[70vh] px-1 overflow-y-auto shadow-md bg-white">
          {roomData?.room?.chats &&
            roomData.room?.chats?.map((chat) => (
              <Comment
                key={chat.id}
                answer={chat.payload}
                createdAt={chat.createdAt}
                user={chat?.user}
                reverse={chat.user.id === loggedInUser.data?.id}
              />
            ))}
        </div>
        {roomData?.room?._count?.chats &&
        roomData.room._count.chats > CHAT_SIZE ? (
          <PageNation pageBack={pageBack} />
        ) : null}
        <form onSubmit={handleSubmit(onValid)} className="">
          <div className="flex relative w-full ">
            <input
              {...register("payload", { required: true })}
              className="focus:border-2 focus:border-orange-400  w-full  p-2  border-[2px] rounded-md placeholder:text-gray-300 text-gray-500 shadow-md"
            />

            <div className="w-[20%] h-full absolute right-0">
              <Button text="Enter" addStyle="h-full" loading={chatLoading} />
            </div>
          </div>
        </form>
      </main>
    </Layout>
  );
};

export default Chat;
