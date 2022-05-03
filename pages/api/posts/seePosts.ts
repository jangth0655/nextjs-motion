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
  try {
    const postCount = await client.post.count({});
    const posts = await client.post.findMany({
      take: pageSize,
      skip: (+page - 1) * pageSize,
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            answers: true,
            favs: true,
          },
        },
        answers: {
          select: {
            answer: true,
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!posts) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }
    if (user) {
      const isMine = Boolean(
        await client.post.findFirst({
          where: {
            userId: user?.id,
          },
          select: {
            id: true,
          },
        })
      );
      return res.status(200).json({ ok: true, posts, postCount, isMine });
    }
    return res.status(200).json({ ok: true, posts, postCount, isMine: false });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Server Not OK" });
  }
};

export default withSession(
  withHandler({
    method: ["GET"],
    handler,
    isPrivate: false,
  })
);
