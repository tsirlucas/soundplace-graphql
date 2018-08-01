import {gql} from 'apollo-server-express';
import {Track} from 'db';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {TopLevelFields} from './util';

export const trackTypes = gql`
  type Track {
    id: ID!
    name: String
    cover: String
    channel: String
  }
`;

const trackQueries = gql`
  type Query {
    track(id: ID!): Track
  }
`;

const trackQueriesResolvers = {
  Query: {
    track: (_obj: any, args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return Track.getInstance().findById(args.id, topLevelFields);
    },
  },
};

export const trackSchema = makeExecutableSchema({
  typeDefs: [trackTypes, trackQueries],
  resolvers: [trackQueriesResolvers],
});
