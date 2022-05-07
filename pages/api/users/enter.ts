import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
//import mail from "@sendgrid/mail";

//mail.setApiKey(process.env.SENDGRID_API_KEY!);

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { email, username },
  } = req;

  if (!email || !username)
    return res
      .status(400)
      .json({ ok: false, error: "Email or Username is required" });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  try {
    const existingUser = await client.user.findFirst({
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

    if (existingUser) {
      return res.send({
        ok: false,
        error: "This username or email is already taken",
      });
    }

    const token = await client.token.create({
      data: {
        payload,
        user: {
          connectOrCreate: {
            where: {
              username,
            },
            create: {
              username: username,
              email: email,
            },
          },
        },
      },
    });

    /* if (email) {
      const email = await mail.send({
        from: "jangth0655@naver.com",
        to: "jangth0655@gmail.com",
        subject: "Your motion Verification Eamil",
        text: `Your token is ${payload}`,
        html: `<strong>Your token is ${payload}</strong>`,
      });
    } */

    return res.status(201).json({ ok: true, token });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ ok: false, error: `${error}가 발생했습니다.` });
  }
};

export default withHandler({
  method: ["POST"],
  handler,
  isPrivate: false,
});
