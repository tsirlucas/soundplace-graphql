import {DBPlaylist} from './DBPlaylist';

export type Playlist = {
  id: DBPlaylist['id'];
  name: DBPlaylist['name'];
  cover: DBPlaylist['cover'];
};
