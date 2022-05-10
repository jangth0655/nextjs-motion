import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { body: imageId } = req;
  try {
    const response = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_IMAGE_ID}/images/v1/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.CLOUD_IMAGE}`,
          },
        }
      )
    ).json();

    if (!response) {
      return res.send({ ok: false, error: "cloudflare error" });
    }
    return res.json({ ok: true, ...response.result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, error: `Delete IMG Error ${error}` });
  }
};

export default withSession(
  withHandler({
    method: ["DELETE"],
    handler,
  })
);

/* const accountId = process.env.CLOUD_IMAGE_ID;
export const deleteImage = async (imageId: string) => {
  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          mode: "no-cors",
          Authorization: `Bearer ${process.env.CLOUD_IMAGE}`,
        },
      }
    )
  ).json();
  console.log(response);
  return;
};
 */
