import {gql} from 'apollo-server-express';
import {Playlist} from 'db';
import graphqlFields from 'graphql-fields';
import {makeExecutableSchema} from 'graphql-tools';

import {GraphQLResolveInfo} from '../../node_modules/@types/graphql';

const playlistTypes = gql`
  type Playlist {
    id: ID!
    name: String
    cover: String
    userId: String
  }
`;

const playlistQueries = gql`
  type Query {
    playlistById(id: ID!): Playlist
    currentUserPlaylists: Playlist
  }
`;

const playlistResolvers = {
  Query: {
    playlistById: (_obj: any, args: any, _context: any, info: GraphQLResolveInfo) => {
      const topLevelFields = Object.keys(graphqlFields(info));
      return Playlist.getInstance().findById(args.id, topLevelFields);
    },
    currentUserPlaylists: (
      _obj: any,
      _args: any,
      {userId}: {userId: string},
      info: GraphQLResolveInfo,
    ) => {
      const topLevelFields = Object.keys(graphqlFields(info));
      return Playlist.getInstance().findBy('user_id', userId, topLevelFields);
    },
  },
};

export const playlistSchema = makeExecutableSchema({
  typeDefs: [playlistTypes, playlistQueries],
  resolvers: [playlistResolvers],
});
