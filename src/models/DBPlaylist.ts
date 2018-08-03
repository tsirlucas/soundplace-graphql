import {DBCover} from './DBCover';

export type DBPlaylist = {
  id: string;
  name: string;
  cover: DBCover;
  user_id: string;
};
