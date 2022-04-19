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
    const alreadyExists = await client.fav.findFirst({
      where: {
        postId: +id,
        userId: user?.id,
      },
    });
    if (alreadyExists) {
      await client.fav.delete({
        where: {
          id: alreadyExists.id,
        },
      });
      return res.status(201).json({ ok: true, message: "Delete Fav" });
    } else {
      await client.fav.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          post: {
            connect: {
              id: +id,
            },
          },
        },
      });
      return res.status(201).json({ ok: true, message: "Create Fav" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
};

export default withSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
  })
);
