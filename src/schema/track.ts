import {gql, withFilter} from 'apollo-server-express';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {Cover, Playlist, PubSub, Track} from 'src/db';
import {Context} from 'src/models';
import {TopLevelFields} from 'src/schema/util';

export const trackTypes = gql`
  type TrackCover {
    id: ID!
    small: String
    medium: String
    big: String
  }

  type Track {
    id: ID!
    name: String
    cover: TrackCover
    channel: String
  }

  type TrackSubs {
    operation: String
    item: Track
  }
`;

const trackQueries = gql`
  type Query {
    track(id: ID!): Track
    playlistTracks(playlistId: ID!): [Track]
  }
`;

const trackSubscriptions = gql`
  type Subscription {
    playlistTracks(playlistId: ID!): TrackSubs
  }
`;

const trackQueriesResolvers = {
  Query: {
    track: (_obj: any, args: any, _context: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).getIdFor(['cover']).get();
      return Track.getInstance().findById(args.id, topLevelFields);
    },
    playlistTracks: (_obj: any, args: any, _context: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).getIdFor(['cover']).get();
      return Playlist.getInstance().findTracks(args.playlistId, topLevelFields);
    },
  },
};

const trackSubscriptionsResolvers = {
  Subscription: {
    playlistTracks: {
      resolve: async (payload: any, _args: any, _context: Context, info: GraphQLResolveInfo) => {
        if (payload.entity === 'TRACK') {
          const {item, operation} = payload;
          const topLevelFields = TopLevelFields(info)
            .inner('item')
            .inner('cover')
            .get();

          const cover = Cover.getInstance().findBy('track_id', item.id, topLevelFields);
          return {operation, item: {...item, cover}};
        } else {
          const topLevelFields = TopLevelFields(info)
            .inner('item')
            .getIdFor(['cover'])
            .get();
          const track = await Track.getInstance().findById(payload.item.track_id, topLevelFields);
          return {operation: payload.operation, item: track};
        }
      },
      subscribe: withFilter(
        () => PubSub.getInstance().pubsub.asyncIterator(['TRACK', 'PLAYLIST_TRACK', 'COVER']),
        async (payload, args) => {
          switch (payload.entity) {
            case 'TRACK':
              return Track.getInstance().checkRelation(payload.item.id, args.playlistId);
            case 'PLAYLIST_TRACK':
              return payload.item.playlist_id === args.playlistId;
            case 'COVER':
              return Track.getInstance().checkRelation(payload.item.track_id, args.playlistId);
            default:
              return false;
          }
        },
      ),
    },
  },
};

export const trackSchema = makeExecutableSchema({
  typeDefs: [trackTypes, trackQueries, trackSubscriptions],
  resolvers: [trackQueriesResolvers, trackSubscriptionsResolvers],
});
