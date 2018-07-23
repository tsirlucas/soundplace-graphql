import {mergeSchemas} from 'graphql-tools';

import {playlistSchema} from './playlist';
import {trackSchema} from './track';
import {userSchema} from './user';

export const schema = mergeSchemas({
  schemas: [userSchema, playlistSchema, trackSchema],
});
