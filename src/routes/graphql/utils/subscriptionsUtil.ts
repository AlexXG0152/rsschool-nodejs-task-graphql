import { FastifyInstance } from "fastify/types/instance";

export const subscribe = async (
  args: { id: string; subscribeToID: string },
  fastify: FastifyInstance
) => {
  const user = await fastify.db.users.findOne({
    key: "id",
    equals: args.id,
  });
  const following = await fastify.db.users.findOne({
    key: "id",
    equals: args.subscribeToID,
  });

  if (user === null || following === null || args.id === args.subscribeToID) {
    throw fastify.httpErrors.notFound();
  }

  if (user.subscribedToUserIds.includes(args.subscribeToID)) return user;

  try {
    return await fastify.db.users.change(args.id, {
      subscribedToUserIds: [...user.subscribedToUserIds, args.subscribeToID],
    });
  } catch (error) {
    throw fastify.httpErrors.badRequest();
  }
};

export const unsubscribe = async (
  args: { id: string; unsubscribeFromID: string },
  fastify: FastifyInstance
) => {
  const user = await fastify.db.users.findOne({
    key: "id",
    equals: args.id,
  });
  const following = await fastify.db.users.findOne({
    key: "id",
    equals: args.unsubscribeFromID,
  });

  if (
    user === null ||
    following === null ||
    args.id === args.unsubscribeFromID
  ) {
    throw fastify.httpErrors.notFound();
  }

  if (!user.subscribedToUserIds.includes(args.unsubscribeFromID)) {
    throw fastify.httpErrors.notFound();
  }

  try {
    user.subscribedToUserIds.splice(
      user.subscribedToUserIds.indexOf(args.unsubscribeFromID),
      1
    );
    return await fastify.db.users.change(args.id, {
      subscribedToUserIds: user.subscribedToUserIds,
    });
  } catch (error) {
    throw fastify.httpErrors.badRequest();
  }
};
