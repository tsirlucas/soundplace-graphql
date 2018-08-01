import {gql} from 'apollo-server-express';
import {Playlist} from 'db';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {Context} from 'models';

import {trackTypes} from './track';
import {TopLevelFields} from './util';

const playlistTypes = gql`
  type Playlist {
    id: ID!
    name: String
    cover: String
    userId: ID!
    tracks: [Track]
  }
`;

const playlistQueries = gql`
  type Query {
    playlist(id: ID!): Playlist
    currentUserPlaylists: [Playlist]
  }
`;

const playlistResolvers = {
  Playlist: {
    tracks: ({id}: any, _args: any, {dataloaders}: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
      return dataloaders.tracksLoader.load({key: id, fields: topLevelFields});
    },
  },
};

const playlistQueriesResolvers = {
  Query: {
    playlist: (_obj: any, args: any, _context: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info)
        .getIdFor(['tracks'])
        .get();
      return Playlist.getInstance().findById(args.id, topLevelFields);
    },
    currentUserPlaylists: (_obj: any, _args: any, {userId}: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info)
        .getIdFor(['tracks'])
        .get();
      return Playlist.getInstance().findBy('user_id', userId, topLevelFields);
    },
  },
};

export const playlistSchema = makeExecutableSchema({
  typeDefs: [playlistTypes, trackTypes, playlistQueries],
  resolvers: [playlistResolvers, playlistQueriesResolvers],
});
