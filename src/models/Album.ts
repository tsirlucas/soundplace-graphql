import {DBAlbum} from './DBAlbum';

export type Album = {
  id: DBAlbum['id'];
  name: DBAlbum['name'];
  cover: DBAlbum['cover'];
};
