import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const sessionConfig = {
  cookieName: "motion",
  password: process.env.IRON_SESSION_PASSWORD!,
};

export const withSession = (handler: NextApiHandler) => {
  return withIronSessionApiRoute(handler, sessionConfig);
};
