import {gql, withFilter} from 'apollo-server-express';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {Cover, Playlist, PubSub} from 'src/db';
import {Context} from 'src/models';
import {trackTypes} from 'src/schema/track';
import {TopLevelFields} from 'src/schema/util';

const playlistTypes = gql`
  type PlaylistCover {
    id: ID!
    small: String
    medium: String
    big: String
  }

  type Playlist {
    id: ID!
    name: String
    cover: PlaylistCover
    userId: ID!
    tracks: [Track]
  }

  type PlaylistSubs {
    operation: String
    item: Playlist
  }
`;

const playlistQueries = gql`
  type Query {
    playlist(id: ID!): Playlist
    currentUserPlaylists: [Playlist]
  }
`;

const playlistSubscriptions = gql`
  type Subscription {
    currentUserPlaylists: PlaylistSubs
  }
`;

const playlistResolvers = {};

const playlistQueriesResolvers = {
  Query: {
    playlist: (_obj: any, args: any, _context: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info)
        .getIdFor(['tracks', 'cover'])
        .get();
      return Playlist.getInstance().findById(args.id, topLevelFields);
    },
    currentUserPlaylists: (_obj: any, _args: any, {userId}: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info)
        .getIdFor(['tracks', 'cover'])
        .get();
      return Playlist.getInstance().findBy('user_id', userId, topLevelFields);
    },
  },
};

const playlistSubscriptionsResolvers = {
  Subscription: {
    currentUserPlaylists: {
      resolve: async (payload: any, _args: any, _context: Context, info: GraphQLResolveInfo) => {
        if (payload.entity === 'PLAYLIST') {
          const {user_id, ...rest} = payload.item;
          const topLevelFields = TopLevelFields(info)
            .inner('item')
            .inner('cover')
            .get();

          const cover = await Cover.getInstance().findBy('playlist_id', rest.id, topLevelFields);
          return {operation: payload.operation, item: {...rest, userId: user_id, cover}};
        } else {
          const topLevelFields = TopLevelFields(info)
            .inner('item')
            .getIdFor(['tracks', 'cover'])
            .get();
          const playlist = await Playlist.getInstance().findById(
            payload.item.playlist_id,
            topLevelFields,
          );
          return {
            operation: payload.operation,
            item: playlist,
          };
        }
      },
      subscribe: (_arg: any, _arg2: any, ctx: Context) =>
        withFilter(
          () => PubSub.getInstance().pubsub.asyncIterator(['PLAYLIST', 'COVER']),
          (payload) => {
            if (payload.entity === 'PLAYLIST') {
              return payload.item.user_id === ctx.userId;
            } else {
              return Playlist.getInstance().checkRelation(payload.item.playlist_id, ctx.userId);
            }
          },
        )(),
      tracks: ({id}: any, _args: any, {dataloaders}: Context, info: GraphQLResolveInfo) => {
        const topLevelFields = TopLevelFields(info).get();
        return dataloaders.tracksLoader.load({key: id, fields: topLevelFields});
      },
    },
  },
};

export const playlistSchema = makeExecutableSchema({
  typeDefs: [playlistTypes, trackTypes, playlistQueries, playlistSubscriptions],
  resolvers: [playlistResolvers, playlistQueriesResolvers, playlistSubscriptionsResolvers],
});
