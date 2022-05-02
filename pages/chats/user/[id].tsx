import Button from "@components/button";
import Comment from "@components/comment";
import Layout from "@components/layout";
import { dateFormat } from "@components/postSlider";
import { deliveryFile } from "@libs/client/deliveryFIle";
import useMutation from "@libs/client/mutation";
import useUser from "@libs/client/useUser";
import { Chat, User } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
}

interface ChatWithRoom extends Chat {
  user: User;
}

interface RoomData {
  ok: boolean;
  id: number;
  room: {
    chats: ChatWithRoom[];
    error?: string;
    users: {
      avatar: string;
      id: number;
      username: string;
    }[];
  };
}

const Chat: NextPage = () => {
  const router = useRouter();
  const loggedInUser = useUser();
  const { register, handleSubmit, reset } = useForm<ChatForm>();
  const { data: currentRoom } = useSWR<RoomId>(
    router.query.id && `/api/chats/userRoom/${router.query.id}`
  );

  const { data: roomData, mutate } = useSWR<RoomData>(
    currentRoom?.room?.id
      ? `/api/chats/seeRoom/${currentRoom?.room?.id}`
      : null,
    {
      refreshInterval: 1000,
    }
  );

  const [sendMessage, { data: chatData, loading: chatLoading }] =
    useMutation<ChatMutation>(
      currentRoom?.room?.id && router.query?.id
        ? `/api/chats?roomId=${currentRoom?.room?.id}&userId=${router.query?.id}`
        : ""
    );

  useEffect(() => {
    const enterUser = roomData?.room.users.map((user) => user.id);
    const enterOk =
      loggedInUser?.data?.id && enterUser?.includes(loggedInUser?.data?.id);
    if (!enterOk) {
      router.replace("/");
    }
  }, [roomData?.room.users, loggedInUser, router]);

  console.log(roomData);

  const onValid = (chatPayload: ChatForm) => {
    console.log(chatPayload);
    if (chatLoading) return;
    mutate(
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

  return (
    <Layout goBack={true}>
      <main className="h-screen p-2 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
        <div className="h-[70vh] border-x-2 px-1 border-orange-200 overflow-y-auto">
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
        <form onSubmit={handleSubmit(onValid)} className="flex relative">
          <input
            {...register("payload", { required: true })}
            className="focus:border-2 focus:border-orange-400  w-full border-orange-200 p-2  border-[2px] rounded-md placeholder:text-gray-300 text-gray-500"
          />

          <div className="w-[20%] h-full absolute right-0">
            <Button text="Enter" addStyle="h-full" loading={chatLoading} />
          </div>
        </form>
      </main>
    </Layout>
  );
};

export default Chat;
