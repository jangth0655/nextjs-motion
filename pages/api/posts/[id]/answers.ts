import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    const {
      body,
      query: { id },
      session: { user },
    } = req;
    // 해당id의 post가 있는지 확인
    const isPost = await client.post.findUnique({
      where: {
        id: +id,
      },
      select: {
        id: true,
      },
    });
    if (!isPost) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }
    // 해당 포스터에 로그인된 유저가 create answer
    const answer = await client.answer.create({
      data: {
        answer: body.answer,
        post: {
          connect: {
            id: +id,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    return res.status(201).json({ ok: true, answer });
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
