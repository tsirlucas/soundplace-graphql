import {gql} from 'apollo-server-express';
import {User} from 'db';
import graphqlFields from 'graphql-fields';
import {makeExecutableSchema} from 'graphql-tools';

import {GraphQLResolveInfo} from '../../node_modules/@types/graphql';

const userTypes = gql`
  type User {
    id: ID!
    name: String
    image: String
  }
`;

const userQueries = gql`
  type Query {
    users: [User]
    userById(id: ID!): User
  }
`;

const userResolvers = {
  Query: {
    users: (_obj: any, _args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = Object.keys(graphqlFields(info));
      return User.getInstance().findAll(topLevelFields);
    },
    userById: (_obj: any, args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = Object.keys(graphqlFields(info));
      return User.getInstance().findById(args.id, topLevelFields);
    },
  },
};

export const userSchema = makeExecutableSchema({
  typeDefs: [userTypes, userQueries],
  resolvers: [userResolvers],
})
