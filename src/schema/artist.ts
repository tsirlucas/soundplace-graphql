import {gql} from 'apollo-server-express';
import {Artist} from 'db';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {TopLevelFields} from './util';

export const artistTypes = gql`
  type Artist {
    id: ID!
    name: String
  }
`;

const artistQueries = gql`
  type Query {
    artist(id: ID!): Artist
  }
`;

const artistQueriesResolvers = {
  Query: {
    artist: (_obj: any, args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return Artist.getInstance().findById(args.id, topLevelFields);
    },
  },
};

export const artistSchema = makeExecutableSchema({
  typeDefs: [artistTypes, artistQueries],
  resolvers: [artistQueriesResolvers],
});
