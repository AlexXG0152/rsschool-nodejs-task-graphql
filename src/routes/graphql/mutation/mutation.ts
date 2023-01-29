import { FastifyInstance } from "fastify";
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { user } from "../types/gqlUser.ts";
import { profile } from "../types/gqlProfile.js";
import { post } from "../types/gqlPost.js";
import { memberType } from "../types/gqlMemberType.js";
import { subscribe, unsubscribe } from "../utils/subscriptionsUtil.js";

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
      updateUser: {
        type: user,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          firstName: { type: new GraphQLNonNull(GraphQLString) },
          lastName: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) =>
          fastify.db.users.change(args.id, {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
          }),
      },
      updateProfile: {
        type: profile,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          avatar: { type: new GraphQLNonNull(GraphQLString) },
          sex: { type: new GraphQLNonNull(GraphQLString) },
          birthday: { type: new GraphQLNonNull(GraphQLString) },
          country: { type: new GraphQLNonNull(GraphQLString) },
          street: { type: new GraphQLNonNull(GraphQLString) },
          city: { type: new GraphQLNonNull(GraphQLString) },
          memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) =>
          fastify.db.profiles.change(args.id, {
            avatar: args.avatar,
            sex: args.sex,
            birthday: args.birthday,
            country: args.country,
            street: args.street,
            city: args.city,
            memberTypeId: args.memberTypeId,
          }),
      },
      updatePost: {
        type: post,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          title: { type: new GraphQLNonNull(GraphQLString) },
          content: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) =>
          fastify.db.posts.change(args.id, {
            title: args.title,
            content: args.content,
          }),
      },
      updateMemberType: {
        type: memberType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          discount: { type: new GraphQLNonNull(GraphQLString) },
          monthPostsLimit: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) =>
          fastify.db.memberTypes.change(args.id, {
            discount: args.discount,
            monthPostsLimit: args.monthPostsLimit,
          }),
      },
      deleteUser: {
        type: user,
        resolve: async (_, args) => fastify.db.users.delete(args.id),
      },
      deleteProfile: {
        type: profile,
        resolve: async (_, args) => fastify.db.profiles.delete(args.id),
      },
      deletePost: {
        type: post,
        resolve: async (_, args) => fastify.db.posts.delete(args.id),
      },
      deleteMemberType: {
        type: memberType,
        resolve: async (_, args) => fastify.db.memberTypes.delete(args.id),
      },
      subscribeTo: {
        type: user,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          subscribeToID: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) => await subscribe(args, fastify),
      },
      unsubscribeFrom: {
        type: user,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          unsubscribeFromID: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) => await unsubscribe(args, fastify),
      },
    },
  });
};
