import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { comment, image },
    session: { user },
  } = req;
  try {
    const post = await client.post.create({
      data: {
        comment,
        image,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
};

export default withSession(
  withHandler({
    method: ["POST"],
    handler,
  })
);
