import {gql} from 'apollo-server-express';
import {Album, Artist, Track} from 'db';
import {makeExecutableSchema} from 'graphql-tools';

import {GraphQLResolveInfo} from '../../node_modules/@types/graphql';
import {albumTypes} from './album';
import {artistTypes} from './artist';
import {TopLevelFields} from './util';

export const trackTypes = gql`
  ${artistTypes}

  ${albumTypes}

  type Track {
    id: ID!
    name: String
    duration: Int
    artistId: ID!
    albumId: ID!
    artist: Artist
    album: Album
  }
`;

const trackQueries = gql`
  type Query {
    trackById(id: ID!): Track
  }
`;

const trackResolvers = {
  Track: {
    artist: (obj: any, _args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return Artist.getInstance().findById(obj.artistId, topLevelFields);
    },
    album: ({albumId}: any, _args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return Album.getInstance().findById(albumId, topLevelFields);
    },
  },
  Query: {
    trackById: (_obj: any, args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info)
        .pickIdsFrom(['artist', 'album'])
        .get();
      return Track.getInstance().findById(args.id, topLevelFields);
    },
  },
};

export const trackSchema = makeExecutableSchema({
  typeDefs: [trackTypes, trackQueries],
  resolvers: [trackResolvers],
});
