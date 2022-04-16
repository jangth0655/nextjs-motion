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
  const user = email ? { email } : { username } ? { username } : null;
  if (!email || !username)
    return res
      .status(400)
      .json({ ok: false, error: "Email or Username is required" });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  try {
    const token = await client.token.create({
      data: {
        payload,
        user: {
          connectOrCreate: {
            where: {
              email,
            },
            create: {
              username: username,
              email: email,
            },
          },
        },
      },
    });
    return res.status(201).json({ ok: true, token });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ ok: false, error });
  }
};

export default withHandler({
  method: ["POST"],
  handler,
  isPrivate: false,
});
