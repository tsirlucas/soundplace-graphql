import {Album} from './Album';
import {Artist} from './Artist';

export type Track = {
  id: string;
  name: string;
  album: Album;
  artist: Artist;
  duration: number;
};
