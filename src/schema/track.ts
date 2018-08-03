import {gql, withFilter} from 'apollo-server-express';
import {Playlist, PubSub, Track} from 'db';
import {GraphQLResolveInfo} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';

import {Context} from 'src/models';

import {TopLevelFields} from './util';

export const trackTypes = gql`
  type Track {
    id: ID!
    name: String
    cover: String
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
      const topLevelFields = TopLevelFields(info).get();
      return Track.getInstance().findById(args.id, topLevelFields);
    },
    playlistTracks: (_obj: any, args: any, _context: Context, info: GraphQLResolveInfo) => {
      const topLevelFields = TopLevelFields(info).get();
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
          return {operation, item};
        } else {
          const topLevelFields = TopLevelFields(info)
            .inner('item')
            .get();
          const track = await Track.getInstance().findById(payload.item.track_id, topLevelFields);
          return {operation: payload.operation, item: track};
        }
      },
      subscribe: withFilter(
        () => PubSub.getInstance().pubsub.asyncIterator(['TRACK', 'PLAYLIST_TRACK']),
        async (payload, args) => {
          if (payload.entity === 'TRACK') {
            return Track.getInstance().checkRelation(payload.item.id, args.playlistId);
          } else {
            return payload.item.playlist_id === args.playlistId;
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
