import {Album} from './Album';

export type DBAlbum = {
  id: Album['id'];
  name: Album['name'];
  cover: Album['cover'];
};
