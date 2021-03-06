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
    query: { page = 1 },
  } = req;
  const pageSize = 5;
  //console.log(myRoom);

  if (!user) {
    return res.status(404).send({ ok: false, error: "Not found" });
  }

  try {
    const me = await client.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        avatar: true,
        username: true,
        id: true,
        email: true,
        _count: {
          select: {
            favs: true,
            posts: true,
          },
        },
      },
    });
    if (!me) {
      return res.status(404).send({ ok: false, error: "Not found" });
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
