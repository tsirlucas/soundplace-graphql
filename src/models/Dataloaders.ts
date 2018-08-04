import Dataloader from 'dataloader';

import {DataloaderParam} from 'src/models/DataloaderParam';
import {Track} from 'src/models/Track';

export interface Dataloaders {
  tracksLoader: Dataloader<DataloaderParam, Track[]>;
}
