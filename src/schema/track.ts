import {gql} from 'apollo-server-express';
import {Track} from 'db';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {Context} from 'models';

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
    track(id: ID!): Track
  }
`;

export const trackResolvers = {
  Track: {
    artist: ({artistId}: any, _args: any, {dataloaders}: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return dataloaders.artistLoader.load({key: artistId, fields: topLevelFields});
    },
    album: ({albumId}: any, _args: any, {dataloaders}: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return dataloaders.albumLoader.load({key: albumId, fields: topLevelFields});
    },
  },
};

const trackQueriesResolvers = {
  Query: {
    track: (_obj: any, args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info)
        .pickIdsFrom(['artist', 'album'])
        .get();
      return Track.getInstance().findById(args.id, topLevelFields);
    },
  },
};

export const trackSchema = makeExecutableSchema({
  typeDefs: [trackTypes, trackQueries],
  resolvers: [trackResolvers, trackQueriesResolvers],
});
