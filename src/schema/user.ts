import {gql, withFilter} from 'apollo-server-express';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {PubSub, User} from 'src/db';
import {Context, DBUser} from 'src/models';
import {TopLevelFields} from 'src/schema/util';

const userTypes = gql`
  type User {
    id: ID!
    name: String
    image: String
    importing: Boolean
  }

  type UserSubs {
    operation: String
    item: User
  }
`;

const userQueries = gql`
  type Query {
    currentUser: User
  }
`;

const userSubscriptions = gql`
  type Subscription {
    currentUser: UserSubs
  }
`;

const userResolvers = {
  Subscription: {
    currentUser: {
      resolve: (payload: DBUser) => payload,
      subscribe: (_arg: any, _arg2: any, ctx: Context) =>
        withFilter(
          () => PubSub.getInstance().pubsub.asyncIterator(['USER']),
          (payload) => payload.item.id === ctx.userId,
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
