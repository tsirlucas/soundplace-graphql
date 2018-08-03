import {DBCover} from './DBCover';

export type DBTrack = {
  id: string;
  name: string;
  channel: string;
  cover: DBCover;
};
