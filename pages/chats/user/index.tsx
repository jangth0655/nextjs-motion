import AvatarSet from "@components/avatarSet";
import Layout from "@components/layout";
import PageNation from "@components/pageNation";
import { withSsrSession } from "@libs/server/withSession";
import { Chat, Room, User } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import { useState } from "react";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { useRouter } from "next/router";
import { dateFormat } from "@components/postSlider";

interface RoomsWithElse extends Room {
  users: User[];
  chats: Chat[];
}

interface RoomsData {
  ok: boolean;
  rooms: {
    avatar: string;
    username: string;
    id: number;
    rooms: RoomsWithElse[];
    _count: {
      rooms: number;
    };
  };
  roomCount: number;
}

const initialPage = 1;
export const pageSize = 10;

const ChatList: NextPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: roomData } = useSWR<RoomsData>(
    `/api/chats/seeRoom?page=${page}`
  );

  const pageBack = (isBack: boolean) => {
    isBack === true
      ? setPage((prev) =>
          prev - initialPage === 0 ? initialPage : prev - initialPage
        )
      : setPage((prev) =>
          roomData?.rooms.rooms &&
          prev > roomData?.rooms.rooms.length / pageSize
            ? 1
            : prev + initialPage
        );
  };

  const othersAvatar = (users: User[]) => {
    const userAvatar = users.filter((user) => user.id !== roomData?.rooms.id);

    return userAvatar[0]?.avatar
      ? userAvatar[0]?.avatar
      : roomData?.rooms.avatar;
  };

  const othersUsername = (users: User[]) => {
    const username = users.filter(
      (user) => user?.username !== roomData?.rooms.username
    );
    return username[0]?.username
      ? username[0]?.username
      : roomData?.rooms.username;
  };

  const othersUserId = (users: User[]) => {
    const username = users?.filter((user) => user.id !== roomData?.rooms.id);
    return username[0]?.id ? username[0]?.id : roomData?.rooms.id;
  };

  const onChat = (id?: number) => {
    router.push(`/chats/user/${id}`);
  };

  return (
    <Layout goBack={true} header="My chat">
      <main className="px-2 text-gray-600">
        <nav className="flex items-center mb-10">
          <h1 className="font-bold text-2xl mr-2 text-gray-700">
            My Chat Rooms
          </h1>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </nav>
        <div>
          {roomData ? (
            roomData?.rooms?.rooms.map((room) => (
              <div
                key={room?.id}
                onClick={() => onChat(othersUserId(room?.users))}
                className="flex items-center justify-between h-24 shadow-sm px-4 hover:bg-orange-100 cursor-pointer rounded-sm bg-white"
              >
                <div className="">
                  <div className="flex items-center ">
                    <div className="mr-1">
                      <AvatarSet avatar={othersAvatar(room?.users)} />
                    </div>
                    <div>
                      <div>
                        <span className="text-sm font-bold">
                          {othersUsername(room?.users)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">
                          {room.chats[0]?.payload}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">
                    {dateFormat(room.createdAt)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4">
              <span className="font-bold text-2xl  text-gray-700">
                등록된 채팅 방이 없습니다.
              </span>
            </div>
          )}
        </div>
        {roomData?.roomCount && roomData?.roomCount > pageSize ? (
          <PageNation pageBack={pageBack} />
        ) : null}
      </main>
    </Layout>
  );
};

const MyChatPage: NextPage<{ rooms: RoomsData; roomCount: number }> = ({
  rooms,
  roomCount,
}) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/chats/seeRoom?page=1": {
            ok: true,
            rooms: rooms,
            roomCount,
          },
        },
      }}
    >
      <ChatList />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async (ctx: NextPageContext) => {
    const rooms = await client.user.findUnique({
      where: {
        id: ctx.req?.session?.user?.id,
      },
      select: {
        avatar: true,
        username: true,
        id: true,
        rooms: {
          select: {
            id: true,
            createdAt: true,
            users: {
              select: {
                id: true,
                avatar: true,
                username: true,
              },
            },
            chats: {
              select: {
                id: true,
                payload: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
    const roomCount = await client.room.count({
      where: {
        users: {
          some: {
            id: ctx.req?.session?.user?.id,
          },
        },
      },
    });

    return {
      props: {
        rooms: JSON.parse(JSON.stringify(rooms)),
        roomCount: JSON.parse(JSON.stringify(roomCount)),
      },
    };
  }
);

export default MyChatPage;
