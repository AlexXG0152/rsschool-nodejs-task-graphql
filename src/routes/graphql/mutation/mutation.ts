import { FastifyInstance } from "fastify";
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { user } from "../types/gqlUser.ts";
import { profile } from "../types/gqlProfile.js";
import { post } from "../types/gqlPost.js";
import { memberType } from "../types/gqlMemberType.js";

export const mutation = async (fastify: FastifyInstance) => {
  return new GraphQLObjectType({
    name: "RootMutationType",
    fields: {
      createUser: {
        type: user,
        args: {
          firstName: { type: new GraphQLNonNull(GraphQLString) },
          lastName: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) =>
          fastify.db.users.create({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
          }),
      },
      createProfile: {
        type: profile,
        args: {
          avatar: { type: new GraphQLNonNull(GraphQLString) },
          sex: { type: new GraphQLNonNull(GraphQLString) },
          birthday: { type: new GraphQLNonNull(GraphQLString) },
          country: { type: new GraphQLNonNull(GraphQLString) },
          street: { type: new GraphQLNonNull(GraphQLString) },
          city: { type: new GraphQLNonNull(GraphQLString) },
          memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
          userId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) =>
          fastify.db.profiles.create({
            avatar: args.avatar,
            sex: args.sex,
            birthday: args.birthday,
            country: args.country,
            street: args.street,
            city: args.city,
            memberTypeId: args.memberTypeId,
            userId: args.userId,
          }),
      },
      createPost: {
        type: post,
        args: {
          title: { type: new GraphQLNonNull(GraphQLString) },
          content: { type: new GraphQLNonNull(GraphQLString) },
          userId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) =>
          fastify.db.posts.create({
            title: args.title,
            content: args.content,
            userId: args.userId,
          }),
      },
      createMemberType: {
        type: memberType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          discount: { type: new GraphQLNonNull(GraphQLString) },
          monthPostsLimit: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) =>
          fastify.db.memberTypes.create({
            id: args.id,
            discount: args.discount,
            monthPostsLimit: args.monthPostsLimit,
          }),
      },
    },
  });
};
