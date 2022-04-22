import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { email, username },
    session: { user },
  } = req;

  if (!email || !username)
    return res
      .status(400)
      .json({ ok: false, error: "Email or Username is required" });

  try {
    const existUser = await client.user.findFirst({
      where: {
        AND: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!existUser) {
      return res.send({ ok: false, error: "Email or Username is incorrect" });
    }
    if (user) {
      return res.status(201).json({ ok: true });
    }
    if (existUser) {
      req.session.user = {
        id: existUser?.id,
      };
      await req.session.save();
      return res.status(201).json({ ok: true });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ ok: false, error: `${error}가 발생했습니다.` });
  }
};

export default withSession(
  withHandler({
    method: ["POST"],
    handler,
    isPrivate: false,
  })
);
