import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const regexExp =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const data = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (data === null) throw reply.code(404);

      return data;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      await fastify.db.users
        .findMany({
          key: "subscribedToUserIds",
          inArray: request.params.id,
        })
        .then((followers) =>
          followers.forEach(async (follower) => {
            follower.subscribedToUserIds.splice(
              follower.subscribedToUserIds.indexOf(request.params.id),
              1
            );
            await fastify.db.users.change(follower.id, {
              subscribedToUserIds: follower.subscribedToUserIds,
            });
          })
        );

      await fastify.db.posts
        .findMany({
          key: "userId",
          equals: request.params.id,
        })
        .then((posts) =>
          posts.forEach(async (post) => {
            await fastify.db.posts.delete(post.id);
          })
        );

      await fastify.db.profiles
        .findOne({
          key: "userId",
          equals: request.params.id,
        })
        .then(async (profile) => {
          if (profile !== null) {
            await fastify.db.profiles.delete(profile!.id);
          }
        });

      if (!regexExp.test(request.params.id)) throw reply.code(400);
      return await fastify.db.users.delete(request.params.id);
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      const following = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (
        user === null ||
        following === null ||
        request.body.userId === request.params.id
      ) {
        throw reply.code(404);
      }

      if (user.subscribedToUserIds.includes(request.params.id)) return user;

      try {
        return await fastify.db.users.change(request.body.userId, {
          subscribedToUserIds: [...user.subscribedToUserIds, request.params.id],
        });
      } catch (error) {
        throw reply.code(400);
      }
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      const following = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (
        user === null ||
        following === null ||
        request.body.userId === request.params.id
      ) {
        throw reply.code(404);
      }

      if (!user.subscribedToUserIds.includes(request.params.id)) {
        throw reply.code(400);
      }

      try {
        user.subscribedToUserIds.splice(
          user.subscribedToUserIds.indexOf(request.params.id),
          1
        );
        return await fastify.db.users.change(request.body.userId, {
          subscribedToUserIds: user.subscribedToUserIds,
        });
      } catch (error) {
        throw reply.code(400);
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        return await fastify.db.users.change(request.params.id, request.body);
      } catch (error) {
        throw reply.code(400);
      }
    }
  );
};

export default plugin;
