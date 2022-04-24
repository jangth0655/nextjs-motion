import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type Method = "GET" | "POST";
type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

type ConfigType = {
  method: Method[];
  handler: Handler;
  isPrivate?: boolean;
};

export default function withHandler({
  method,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
  ) {
    if (req.method && !method.includes(req.method as Method)) {
      return res
        .status(405)
        .json({ ok: false, error: "Request method is not correct" });
    }
    if (isPrivate && !req?.session?.user) {
      return res.json({ ok: false, error: "Plz log in." });
    }
    try {
      return await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, error: "Server not working" });
    }
  };
}
