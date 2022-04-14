import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { email, username },
  } = req;
  const user = { email, username };
  if (!email || !username)
    return res
      .status(400)
      .json({ ok: false, error: "Email or Useranem is required" });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            username,
            email,
          },
        },
      },
    },
  });
  res.status(201).json({ ok: true });
};

export default withHandler({
  method: "POST",
  handler,
  isPrivate: false,
});
