import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphqlBodySchema } from "./schema";
import { GraphQLSchema, graphql } from "graphql";
import { mutation } from "./mutation/mutation";
import { query } from "./query/query";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {

      const schema = new GraphQLSchema({
        mutation: await mutation(fastify),
        query: await query(fastify),
      });

      return await graphql({
        schema: schema,
        source: request.body.query!,
        contextValue: fastify,
        variableValues: {},
      });
    }
  );
};

export default plugin;
