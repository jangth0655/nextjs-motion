import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { comment, imageId },
    session: { user },
  } = req;

  console.log(req.body);

  try {
    const post = await client.post.create({
      data: {
        comment,
        image: imageId ? imageId : null,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    return res.status(200).send({ ok: true, post });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, error });
  }
};

export default withSession(
  withHandler({
    method: ["POST"],
    handler,
  })
);
