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
    query: { page },
  } = req;

  const pageSize = 10;

  try {
    const roomCount = await client.room.count({
      where: {
        users: {
          some: {
            id: user?.id,
          },
        },
      },
    });
    const rooms = await client.user.findUnique({
      where: {
        id: user?.id,
      },

      select: {
        avatar: true,
        username: true,
        id: true,
        rooms: {
          take: pageSize,
          skip: (+page - 1) * pageSize,
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
    if (!rooms) {
      return res.json({ ok: false, error: "Room does not exist" });
    }
    return res.status(200).json({ ok: true, rooms, roomCount });
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
