import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_IMAGE_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${process.env.CLOUD_IMAGE}`,
        },
      }
    )
  ).json();

  try {
    res.json({ ok: true, ...response.result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
};

export default withSession(
  withHandler({
    method: ["GET"],
    handler,
  })
);