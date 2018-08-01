import {gql, withFilter} from 'apollo-server-express';
import {PubSub, User} from 'db';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {Context, DBUser} from 'src/models';

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

const userSubscriptions = gql`
  type Subscription {
    currentUser: User
  }
`;

const userResolvers = {
  Subscription: {
    currentUser: {
      resolve: (payload: DBUser) => payload,
      subscribe: (_arg: any, _arg2: any, ctx: Context) =>
        withFilter(
          () => PubSub.getInstance().pubsub.asyncIterator(['UPDATE_USER']),
          (payload) => payload.id === ctx.userId,
        )(),
    },
  },
  Query: {
    currentUser: (_obj: any, _args: any, {userId}: {userId: string}, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return User.getInstance().findById(userId, topLevelFields);
    },
  },
};

export const userSchema = makeExecutableSchema({
  typeDefs: [userTypes, userQueries, userSubscriptions],
  resolvers: [userResolvers],
});
