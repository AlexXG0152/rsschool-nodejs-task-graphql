import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const regexExp =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (profile === null) throw reply.code(404);

      return profile;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },

    async function (request, reply): Promise<ProfileEntity> {
      if (!regexExp.test(request.body.userId)) throw reply.code(400);

      const user = await fastify.db.profiles.findOne({
        key: "userId",
        equals: request.body.userId,
      });
      if (user) throw reply.code(404);

      const memberType = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: request.body.memberTypeId,
      });
      if (memberType === null) throw reply.code(400);

      return await fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (profile === null) throw reply.code(400);

      return await fastify.db.profiles.delete(request.params.id);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        return await fastify.db.profiles.change(
          request.params.id,
          request.body
        );
      } catch (error) {
        throw reply.code(400);
      }
    }
  );
};

export default plugin;
