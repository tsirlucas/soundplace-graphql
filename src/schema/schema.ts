import {mergeSchemas} from 'graphql-tools';

import {playlistSchema} from 'src/schema/playlist';
import {trackSchema} from 'src/schema/track';
import {userSchema} from 'src/schema/user';

export const schema = mergeSchemas({
  schemas: [userSchema, playlistSchema, trackSchema],
});
