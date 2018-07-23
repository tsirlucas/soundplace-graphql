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
    (params: DataloaderParam[]) => {
      const ids = params.map((param) => param.key);
      const fields = params[0].fields;
      return Artist.getInstance()
        .batch(ids, fields)
        .catch((e) => {
          console.log(e);
          return e;
        });
    },
    {cacheKeyFn: (param: DataloaderParam) => param.key},
  );

  public albumLoader = new Dataloader<DataloaderParam, TAlbum>(
    (params: DataloaderParam[]) => {
      const ids = params.map((param) => param.key);
      const fields = params[0].fields;
      return Album.getInstance()
        .batch(ids, fields)
        .catch((e) => {
          console.log(e);
          return e;
        });
    },
    {cacheKeyFn: (param: DataloaderParam) => param.key},
  );

  groupBy(xs: any[], key: string) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
}
