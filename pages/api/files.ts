import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    const response = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_IMAGE_ID}/images/v1/direct_upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CLOUD_IMAGE}`,
          },
        }
      )
    ).json();
    console.log(response);
    if (!response) {
      return res.send({ ok: false, error: "cloudflare error" });
    }
    return res.json({ ok: true, ...response.result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Upload IMG Error" });
  }
};

export default withSession(
  withHandler({
    method: ["GET"],
    handler,
  })
);
