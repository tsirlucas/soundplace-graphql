import {gql} from 'apollo-server-express';
import {Artist} from 'db';
import {makeExecutableSchema} from 'graphql-tools';

import {GraphQLResolveInfo} from '../../node_modules/@types/graphql';
import {TopLevelFields} from './util';

export const artistTypes = gql`
  type Artist {
    id: ID!
    name: String
  }
`;

const artistQueries = gql`
  type Query {
    artistById(id: ID!): Artist
  }
`;

const artistResolvers = {
  Query: {
    artistById: (_obj: any, args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return Artist.getInstance().findById(args.id, topLevelFields);
    },
  },
};

export const artistSchema = makeExecutableSchema({
  typeDefs: [artistTypes, artistQueries],
  resolvers: [artistResolvers],
});
