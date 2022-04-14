import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type Method = "GET" | "POST";
type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

type ConfigType = {
  method: Method;
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
    if (req.method !== method) {
      return res
        .status(405)
        .json({ ok: false, error: "Request method is not correct" });
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: "Plz log in." });
    }
    try {
      return await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: true, error: "Server not working" });
    }
  };
}
