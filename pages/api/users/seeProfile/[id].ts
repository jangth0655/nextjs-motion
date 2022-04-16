import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
  } = req;
  try {
    const profile = await client.user.findUnique({
      where: {
        id: +id,
      },
      select: {
        avatar: true,
        username: true,
        id: true,
        posts: {
          select: {
            comment: true,
            image: true,
            id: true,
          },
        },
      },
    });
    if (!profile) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }
    return res.status(200).json({ ok: true, profile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "" });
  }
};

export default withSession(
  withHandler({
    method: ["GET"],
    handler,
    isPrivate: false,
  })
);
