import Dataloader from 'dataloader';
import {Playlist} from 'db';
import groupBy from 'lodash.groupby';

import {DataloaderParam, Track as TTrack} from 'models';

export class Dataloaders {
  public tracksLoader = new Dataloader<DataloaderParam, TTrack[]>(
    async (params: DataloaderParam[]) => {
      try {
        const ids = params.map((param) => param.key);
        const fields = params[0].fields;
        const result = await Playlist.getInstance().batchFindTracks(ids, fields);
        const grouped = groupBy(result, 'playlistId');
        return ids.map((id) => grouped[id]);
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    {cacheKeyFn: (param: DataloaderParam) => param.key},
  );

  sortBased(toSort: any[], baseArr: any[]) {
    var indexObject = toSort.reduce((result, currentObject) => {
      result[currentObject.id] = currentObject;
      return result;
    }, {});

    return baseArr.map((id) => {
      return indexObject[id];
    });
  }
}
