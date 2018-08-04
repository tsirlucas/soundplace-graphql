import {DBConnection} from 'src/db/DBConnection';
import {Track as TTrack} from 'src/models';

import {Cover} from './Cover';

export class Track {
  private static instance: Track;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Track();
    }

    return this.instance;
  }

  public async findById(id: string, fields: string[]): Promise<TTrack> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM track_data WHERE id=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [id]);
    const cover = await Cover.getInstance().findBy('track_id', id, ['*']);
    const track = rows[0] as TTrack;
    track.cover = cover;
    return track;
  }

  public async batchFindByIds(ids: string[], fields: string[]): Promise<TTrack[]> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM track_data WHERE id= ANY($1);`;
    let {rows} = await DBConnection.getInstance().query(query, [[ids]]);
    const covers = await Cover.getInstance().batchFindBy('track_id', ids, ['*']);
    rows = rows.map((row: TTrack, index) => {
      row.cover = covers[index];
      return row;
    });
    return rows;
  }

  public async checkRelation(id: string, playlistId: string) {
    const query = `SELECT * FROM playlist_track WHERE track_id=$1 AND playlist_id=$2;`;
    const {rows} = await DBConnection.getInstance().query(query, [id, playlistId]);
    return rows.length > 0;
  }
}
