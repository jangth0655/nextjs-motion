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
    query: { id },
  } = req;
  console.log(req.query);

  try {
    const room = await client.room.findFirst({
      where: {
        id: +id,
      },
      select: {
        chats: true,
        users: {
          select: {
            username: true,
            id: true,
            avatar: true,
          },
        },
      },
    });
    if (!room) {
      return res.status(404).json({ ok: false, error: "Room does not exist" });
    }
    return res.status(200).json({ ok: true, room });
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
