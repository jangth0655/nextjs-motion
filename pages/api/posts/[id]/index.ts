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
    query: { id, post, page },
  } = req;

  try {
    if (req.method === "GET") {
      if (post) {
        const postContent = await client.post.findUnique({
          where: {
            id: +id,
          },
          select: {
            comment: true,
            image: true,
            id: true,
          },
        });
        return res.json({ ok: true, postContent });
      }

      const pageSize = 3;
      const seePost = await client.post.findUnique({
        where: {
          id: +id,
        },
        include: {
          user: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
          _count: {
            select: {
              answers: true,
              favs: true,
            },
          },
          answers: {
            select: {
              answer: true,
              id: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  email: true,
                },
              },
            },
            take: pageSize,
            skip: (+page - 1) * pageSize,
          },
        },
      });

      const isLiked = Boolean(
        await client.fav.findFirst({
          where: {
            postId: seePost?.id,
            userId: user?.id,
          },
          select: {
            id: true,
          },
        })
      );

      return res.status(200).json({ ok: true, seePost, isLiked });
    }

    if (req.method === "POST") {
      const {
        body: { imageId, comment },
      } = req;

      if (id) {
        const alreadyPost = await client.post.findUnique({
          where: {
            id: +id,
          },
          select: {
            id: true,
            image: true,
            comment: true,
          },
        });

        if (!alreadyPost) {
          return res.status(404).json({ ok: false, error: "Not found post" });
        }
        if (imageId && imageId !== alreadyPost.image) {
          const updateImage = await client.post.update({
            where: {
              id: alreadyPost.id,
            },
            data: {
              image: imageId,
            },
          });
          return res.status(201).json({ ok: true, updateImage });
        }
        if (comment && comment !== alreadyPost.comment) {
          const updateComment = await client.post.update({
            where: {
              id: alreadyPost.id,
            },
            data: {
              comment,
            },
          });
          return res.status(201).json({ ok: true, updateComment });
        }
      } else {
        return res.status(401).json({ ok: false, error: "You are not user" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
};

export default withSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
  })
);
