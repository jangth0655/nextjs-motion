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
  const { body } = req;
  const token = await client.token.findUnique({
    where: {
      payload: body.token,
    },
    select: {
      userId: true,
    },
  });
  if (!token) {
    return res.status(401).json({ ok: false, error: "Token not found" });
  } else {
    req.session.user = {
      id: token.userId,
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
    method: "POST",
    handler,
    isPrivate: false,
  })
);
