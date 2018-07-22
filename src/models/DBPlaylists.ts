import {Assign} from 'utility-types';

import {Playlist} from './Playlist';

export type DBPlaylist = Assign<Playlist, {user_id: string}>;
