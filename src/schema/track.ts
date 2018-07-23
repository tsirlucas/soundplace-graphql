import {gql} from 'apollo-server-express';
import {Track} from 'db';
import graphqlFields from 'graphql-fields';
import {makeExecutableSchema} from 'graphql-tools';

import {GraphQLResolveInfo} from '../../node_modules/@types/graphql';

export const trackTypes = gql`
  type Track {
    id: ID!
    name: String
    duration: Int
    artistId: ID!
    albumId: ID!
  }
`;

const trackQueries = gql`
  type Query {
    trackById(id: ID!): Track
  }
`;

const trackResolvers = {
  Query: {
    trackById: (_obj: any, args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = Object.keys(graphqlFields(info));
      return Track.getInstance().findById(args.id, topLevelFields);
    },
  },
};

export const trackSchema = makeExecutableSchema({
  typeDefs: [trackTypes, trackQueries],
  resolvers: [trackResolvers],
});
