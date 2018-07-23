import {gql} from 'apollo-server-express';
import {Album} from 'db';
import {makeExecutableSchema} from 'graphql-tools';

import {GraphQLResolveInfo} from '../../node_modules/@types/graphql';
import {TopLevelFields} from './util';

export const albumTypes = gql`
  type Album {
    id: ID!
    name: String
    cover: String
  }
`;

const albumQueries = gql`
  type Query {
    album(id: ID!): Album
  }
`;

const albumQueriesResolvers = {
  Query: {
    album: (_obj: any, args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return Album.getInstance().findById(args.id, topLevelFields);
    },
  },
};

export const albumSchema = makeExecutableSchema({
  typeDefs: [albumTypes, albumQueries],
  resolvers: [albumQueriesResolvers],
});
