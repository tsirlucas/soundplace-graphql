import {mergeSchemas} from 'graphql-tools';

import {albumSchema} from './album';
import {artistSchema} from './artist';
import {playlistSchema} from './playlist';
import {trackSchema} from './track';
import {userSchema} from './user';

export const schema = mergeSchemas({
  schemas: [userSchema, playlistSchema, trackSchema, albumSchema, artistSchema],
});
