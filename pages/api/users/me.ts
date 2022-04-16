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
  } = req;

  try {
    const me = await client.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        id: true,
        avatar: true,
        username: true,
        email: true,
      },
    });
    if (!me) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    return res.status(200).json({ ok: true, me });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Server Error" });
  }
};

export default withSession(
  withHandler({
    method: ["GET"],
    handler,
  })
);
