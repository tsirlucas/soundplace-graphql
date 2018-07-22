import {Track} from './Track';

export type DBTrack = {
  id: Track['id'];
  name: Track['name'];
  album_id: Track['album']['id'];
  duration: Track['duration'];
};
