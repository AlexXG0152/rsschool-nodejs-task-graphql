import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import { profile } from "./gqlProfile";
import { FastifyInstance } from "fastify/types/instance";
import { post } from "./gqlPost";

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
    name: "UserProfiles",
    fields: {
      user: {
        type: user,
        resolve: async (parent: UserEntity) => parent,
      },
      subscribedToUser: {
        type: new GraphQLList(user),
        resolve: async (parent: UserEntity) => {
          const subscribedToUser = await fastify.db.users.findMany({
            key: "subscribedToUserIds",
            inArray: parent.id,
          });

          return subscribedToUser;
        },
      },
      profile: {
        type: profile,
        resolve: async (parent: UserEntity) => {
          const profile = await fastify.db.profiles.findOne({
            key: "userId",
            equals: parent.id,
          });

          return profile;
        },
      },
      posts: {
        type: new GraphQLList(post),
        resolve: async (parent: UserEntity) => {
          const posts = await fastify.db.posts.findMany({
            key: "userId",
            equals: parent.id,
          });

          return posts;
        },
      },
    },
  });

  return userData;
};
