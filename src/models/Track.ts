import {Album} from './Album';
import {Artist} from './Artist';
import {DBTrack} from './DBTrack';

export type Track = {
  id: DBTrack['id'];
  name: DBTrack['name'];
  album: Album;
  artist: Artist;
  duration: DBTrack['duration'];
};
