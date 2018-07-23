import Dataloader from 'dataloader';
import {Album, Artist} from 'db';

import {Album as TAlbum, Artist as TArtist, DataloaderParam} from 'models';

export class Dataloaders {
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
}
