import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const pageSize = 5;
const initialPage = 1;
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id, page = initialPage },
  } = req;

  try {
    const userPost = await client.user.findUnique({
      where: {
        id: +id,
      },
      include: {
        posts: {
          take: pageSize,
          skip: (+page - 1) * pageSize,
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            posts: true,
            favs: true,
            answers: true,
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
