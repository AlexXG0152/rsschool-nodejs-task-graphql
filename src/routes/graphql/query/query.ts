import { FastifyInstance } from "fastify";
import { GraphQLID, GraphQLList, GraphQLObjectType } from "graphql";
import { user } from "../types/gqlUser.ts";
import { profile } from "../types/gqlProfile.js";
import { post } from "../types/gqlPost.js";
import { memberType } from "../types/gqlMemberType.js";

export const query = async (fastify: FastifyInstance) => {
  return new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      memberTypes: {
        type: new GraphQLList(memberType),
        resolve: async () => fastify.db.memberTypes.findMany(),
      },
      posts: {
        type: new GraphQLList(post),
        resolve: async () => fastify.db.posts.findMany(),
      },
      profiles: {
        type: new GraphQLList(profile),
        resolve: async () => fastify.db.profiles.findMany(),
      },
      users: {
        type: new GraphQLList(user),
        resolve: async () => fastify.db.users.findMany(),
      },
      memberType: {
        type: memberType,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (_parent, args) =>
          await fastify.db.memberTypes.findOne({ key: "id", equals: args.id }),
      },
      post: {
        type: post,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (_parent, args) =>
          await fastify.db.posts.findOne({ key: "id", equals: args.id }),
      },
      profile: {
        type: profile,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (_parent, args) =>
          await fastify.db.profiles.findOne({ key: "id", equals: args.id }),
      },
      user: {
        type: user,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args, context) =>
          await fastify.db.users.findOne({ key: "id", equals: args.id }),
      },
    },
  });
};
