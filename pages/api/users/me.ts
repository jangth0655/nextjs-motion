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
    query: { posts, page = 1, home },
  } = req;
  const pageSize = 5;

  if (!user) {
    return res.status(404).send({ ok: false, error: "Not found" });
  }

  try {
    if (posts) {
      const userPostData = await client.user.findUnique({
        where: {
          id: user?.id,
        },
        select: {
          avatar: true,
          username: true,
          id: true,
          email: true,
          posts: {
            take: pageSize,
            skip: (+page - 1) * pageSize,
            select: {
              comment: true,
              id: true,
              image: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              favs: true,
              posts: true,
              answers: true,
            },
          },
        },
      });
      if (!userPostData) {
        return res.status(404).send({ ok: false, error: "Not found" });
      }

      return res.status(200).json({ ok: true, userPostData });
    }

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
