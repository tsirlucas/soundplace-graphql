import Dataloader from 'dataloader';
import {Album, Artist, Playlist} from 'db';
import groupBy from 'lodash.groupby';

import {Album as TAlbum, Artist as TArtist, DataloaderParam, Track as TTrack} from 'models';

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

  public artistLoader = new Dataloader<DataloaderParam, TArtist>(
    async (params: DataloaderParam[]) => {
      try {
        const ids = params.map((param) => param.key);
        const fields = params[0].fields;
        const result = await Artist.getInstance().batch(ids, fields);
        return this.sortBased(result, ids);
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    {cacheKeyFn: (param: DataloaderParam) => param.key},
  );

  public albumLoader = new Dataloader<DataloaderParam, TAlbum>(
    async (params: DataloaderParam[]) => {
      try {
        const ids = params.map((param) => param.key);
        const fields = params[0].fields;
        const result = await Album.getInstance().batch(ids, fields);

        return this.sortBased(result, ids);
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
