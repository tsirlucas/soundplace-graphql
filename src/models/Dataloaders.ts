import Dataloader from 'dataloader';

import {Album} from './Album';
import {Artist} from './Artist';
import {DataloaderParam} from './DataloaderParam';
import {Track} from './Track';

export interface Dataloaders {
  albumLoader: Dataloader<DataloaderParam, Album>;
  artistLoader: Dataloader<DataloaderParam, Artist>;
  tracksLoader: Dataloader<DataloaderParam, Track[]>;
}
