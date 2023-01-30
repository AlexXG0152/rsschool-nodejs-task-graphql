import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import { profile } from "./gqlProfile";
import { FastifyInstance } from "fastify/types/instance";
import { post } from "./gqlPost";
import { memberType } from "./gqlMemberType";

export const user = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  },
});

export const allUserData = async (fastify: FastifyInstance) => {
  const userData = new GraphQLObjectType({
    name: "allUserData",
    fields: {
      user: {
        type: user,
        resolve: async (parent: UserEntity) => parent,
      },

      users: {
        type: new GraphQLList(user),
        resolve: async () => await fastify.db.users.findMany(),
      },

      subscribedToUser: {
        type: new GraphQLList(user),
        resolve: async (parent: UserEntity) => {
          return parent.subscribedToUserIds.map(
            async (id) =>
              await fastify.db.users.findOne({ key: "id", equals: id })
          );
        },
      },

      profile: {
        type: profile,
        resolve: async (parent: UserEntity) => {
          return await fastify.db.profiles.findOne({
            key: "userId",
            equals: parent.id,
          });
        },
      },

      posts: {
        type: new GraphQLList(post),
        resolve: async (parent: UserEntity) => {
          return await fastify.db.posts.findMany({
            key: "userId",
            equals: parent.id,
          });
        },
      },

      memberType: {
        type: memberType,
        resolve: async (parent: UserEntity) => {
          const profile = await fastify.db.profiles.findOne({
            key: "userId",
            equals: parent.id,
          });

          return await fastify.db.memberTypes.findOne({
            key: "id",
            equals: profile!.memberTypeId,
          });
        },
      },
    },
  });

  return userData;
};
