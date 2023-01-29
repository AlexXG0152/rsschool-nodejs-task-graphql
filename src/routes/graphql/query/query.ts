import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { user, allUserData } from "../types/gqlUser.ts";
import { profile } from "../types/gqlProfile.js";
import { post } from "../types/gqlPost.js";
import { memberType } from "../types/gqlMemberType.js";

export const query = async (fastify: FastifyInstance) => {
  const userData = await allUserData(fastify);
  return new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      memberTypes: {
        type: new GraphQLList(memberType),
        resolve: async () => await fastify.db.memberTypes.findMany(),
      },
      posts: {
        type: new GraphQLList(post),
        resolve: async () => await fastify.db.posts.findMany(),
      },
      profiles: {
        type: new GraphQLList(profile),
        resolve: async () => await fastify.db.profiles.findMany(),
      },
      users: {
        type: new GraphQLList(user),
        resolve: async () => await fastify.db.users.findMany(),
      },
      memberType: {
        type: memberType,
        args: {
          id: { type: GraphQLString },
        },
        resolve: async (_parent, args) =>
          await fastify.db.memberTypes.findOne({ key: "id", equals: args.id }),
      },
      post: {
        type: post,
        args: {
          id: { type: GraphQLString },
        },
        resolve: async (_parent, args) =>
          await fastify.db.posts.findOne({ key: "id", equals: args.id }),
      },
      profile: {
        type: profile,
        args: {
          id: { type: GraphQLString },
        },
        resolve: async (_parent, args) =>
          await fastify.db.profiles.findOne({ key: "id", equals: args.id }),
      },
      user: {
        type: user,
        args: {
          id: { type: GraphQLString },
        },
        resolve: async (_parent, args) =>
          await fastify.db.users.findOne({ key: "id", equals: args.id }),
      },
      allUsersData: {
        type: new GraphQLList(userData),
        resolve: async () => fastify.db.users.findMany(),
      },
      oneUserAllData: {
        type: (userData),
        args: {
          id: { type: GraphQLString },
        },
        resolve: async (_parent, args) =>
          fastify.db.users.findOne({ key: "id", equals: args.id }),
      }, 
    },
  });
};
