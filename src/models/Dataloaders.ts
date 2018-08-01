import Dataloader from 'dataloader';

import {DataloaderParam} from './DataloaderParam';
import {Track} from './Track';

export interface Dataloaders {
  tracksLoader: Dataloader<DataloaderParam, Track[]>;
}
