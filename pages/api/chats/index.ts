import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    session: { user },
    query: { roomId, page = 1, userId },
    body: { payload, otherUserId },
  } = req;

  try {
    if (req.method === "GET") {
      const pageSize = 5;
      const rooms = await client.room.findMany({
        take: pageSize,
        skip: (+page - 1) * pageSize,
        select: {
          id: true,
        },
      });
      if (!rooms) {
        return res
          .status(404)
          .json({ ok: false, error: "Room does not exist" });
      }
      return res.status(200).json({ ok: true, rooms });
    }
    if (req.method === "POST") {
      // 유저, 룸 있는지 확인
      // 룸이 있으면 메시지를 만들고
      // 없으면 룸을 만들고
      const otherId = +userId ? +userId : +otherUserId;
      const existsUser = await client.user.findUnique({
        where: {
          id: +otherId,
        },
        select: {
          id: true,
        },
      });
      if (!existsUser) {
        return res
          .status(404)
          .json({ ok: false, error: "User does not exist" });
      }
      if (!roomId) {
        const room = await client.room.create({
          data: {
            users: {
              connect: [{ id: +otherId }, { id: user?.id }],
            },
          },
        });
        return res.status(201).json({ ok: true, room });
      } else if (roomId) {
        const existsRoom = await client.room.findUnique({
          where: {
            id: +roomId,
          },
          select: {
            id: true,
          },
        });
        if (!existsRoom) {
          return res
            .status(404)
            .json({ ok: false, error: "Chatting room does not exist" });
        }
        if (payload) {
          const chat = await client.chat.create({
            data: {
              payload,
              user: {
                connect: {
                  id: user?.id,
                },
              },
              room: {
                connect: {
                  id: +roomId,
                },
              },
            },
          });

          return res.status(201).json({ ok: true, chat });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
};

export default withSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
  })
);
