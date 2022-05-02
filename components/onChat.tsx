import useMutation from "@libs/client/mutation";
import useSWR from "swr";

interface makeChatRoom {
  id: number;
  userId: number;
}

interface RoomMutation {
  ok: boolean;
  room: {
    id: number;
  };
}

interface RoomConfirm {
  ok: boolean;
  room: {
    id: number;
  };
  error?: string;
}

const OnChat = ({ id, userId }: makeChatRoom) => {
  //if(!id && !userId) return

  const [sendChat, { data }] = useMutation<RoomMutation>(
    `/api/chats?userId=${userId}`
  );

  const { data: roomConfirm, mutate } = useSWR<RoomConfirm>(
    `/api/chats/userRoom/${userId}`
  );

  return {};
};

export default OnChat;
