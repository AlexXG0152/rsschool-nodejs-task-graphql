import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

export const memberType = new GraphQLObjectType({
  name: "MemberType",
  fields: {
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});
