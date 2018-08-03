import {gql, withFilter} from 'apollo-server-express';
import {Playlist, PubSub} from 'db';
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

const playlistSubscriptionsResolvers = {
  Subscription: {
    currentUserPlaylists: {
      resolve: (payload: any) => {
        const {user_id, ...rest} = payload.item;
        return {operation: payload.operation, item: {...rest, userId: user_id}};
      },
      subscribe: (_arg: any, _arg2: any, ctx: Context) =>
        withFilter(
          () => PubSub.getInstance().pubsub.asyncIterator(['PLAYLIST']),
          (payload) => payload.item.user_id === ctx.userId,
        )(),
    },
  },
};

export const playlistSchema = makeExecutableSchema({
  typeDefs: [playlistTypes, trackTypes, playlistQueries, playlistSubscriptions],
  resolvers: [playlistResolvers, playlistQueriesResolvers, playlistSubscriptionsResolvers],
});
