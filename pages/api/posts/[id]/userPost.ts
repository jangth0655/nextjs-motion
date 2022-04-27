import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { userId },
  } = req;

  try {
    const userPost = await client.user.findUnique({
      where: {
        id: +userId,
      },
      include: {
        posts: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!userPost) {
      return res.send({ ok: true });
    } else {
      return res.status(200).json({ ok: true, userPost });
    }
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
