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

  const isMine = Boolean(
    await client.post.findFirst({
      where: {
        id: +id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  try {
    const exists = await client.post.findUnique({
      where: {
        id: +id,
      },
    });

    if (!exists) {
      return res.status(400).json({ ok: false, error: "Could not find post" });
    }
    if (isMine) {
      const ok = await client.post.delete({
        where: {
          id: +id,
        },
      });
      return res.status(201).json({ ok: true, error: "Delete post" });
    } else {
      return res.status(400).json({ ok: false, error: "User is invalid" });
    }
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
