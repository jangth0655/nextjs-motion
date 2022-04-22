import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";

import { NextApiRequest, NextApiResponse } from "next";
//import mail from "@sendgrid/mail";
//mail.setApiKey(process.env.SENDGRID_API_KEY!);

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { token },
  } = req;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    select: {
      userId: true,
    },
  });
  if (!foundToken) {
    return res.json({ ok: false, error: "Token not found" });
  } else {
    req.session.user = {
      id: foundToken.userId,
    };
    await req.session.save();
    await client.token.deleteMany({
      where: {
        userId: req.session.user.id,
      },
    });
  }

  res.status(200).json({ ok: true });
};

export default withSession(
  withHandler({
    method: ["POST"],
    handler,
    isPrivate: false,
  })
);
