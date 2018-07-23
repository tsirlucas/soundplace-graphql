import {gql} from 'apollo-server-express';
import {User} from 'db';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {TopLevelFields} from './util';

const userTypes = gql`
  type User {
    id: ID!
    name: String
    image: String
  }
`;

const userQueries = gql`
  type Query {
    currentUser: User
  }
`;

const userResolvers = {
  Query: {
    currentUser: (_obj: any, _args: any, {userId}: {userId: string}, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return User.getInstance().findById(userId, topLevelFields);
    },
  },
};

export const userSchema = makeExecutableSchema({
  typeDefs: [userTypes, userQueries],
  resolvers: [userResolvers],
});
