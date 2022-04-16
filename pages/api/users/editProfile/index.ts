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
    body: { email, username, avatar },
  } = req;

  try {
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });
    if (!currentUser) {
      return res.status(404).json({ ok: false, error: "Not found User" });
    }
    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyExists) {
        return res.json({ ok: false, error: "Email already token" });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
      return res.json({ ok: true });
    }

    if (username && username !== currentUser.username) {
      const alreadyUsername = Boolean(
        await client.user.findUnique({
          where: {
            username,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyUsername) {
        return res
          .status(400)
          .json({ ok: false, error: "Username. already token" });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          username,
        },
      });
      return res.status(200).json({ ok: true });
    }

    if (avatar) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar,
        },
      });
      return res.status(200).json({ ok: true });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Server Error" });
  }
};

export default withSession(
  withHandler({
    method: ["POST"],
    handler,
  })
);
