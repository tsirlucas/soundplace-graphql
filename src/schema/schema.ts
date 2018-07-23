import {mergeSchemas} from 'graphql-tools';

import {playlistSchema} from './playlist';
import {userSchema} from './user';

export const schema = mergeSchemas({
  schemas: [userSchema, playlistSchema],
});
