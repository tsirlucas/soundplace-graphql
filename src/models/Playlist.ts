import {DBPlaylist} from 'src/models/DBPlaylist';

export type Playlist = {
  id: DBPlaylist['id'];
  name: DBPlaylist['name'];
  cover: DBPlaylist['cover'];
};
