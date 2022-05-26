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

  try {
    const chatList = await client.chat.findMany({
      where: {
        roomId: +id,
      },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!chatList) {
      return res.send({ ok: false, error: "Not found chat." });
    }
    const lastChatUserId = chatList[chatList.length - 1].userId;
    return res.send({ ok: true, lastChatUserId, chatList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
};

export default withSession(
  withHandler({
    method: ["GET"],
    handler,
  })
);
