import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { GraphQLSchema, graphql } from "graphql";
import * as depthLimit from "graphql-depth-limit";
import { graphqlBodySchema } from "./schema";
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
        validationRules: [depthLimit(6)],
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
        variableValues: request.body.variables,
      });
    }
  );
};

export default plugin;
