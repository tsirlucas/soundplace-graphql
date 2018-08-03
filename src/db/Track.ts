import {Track as TTrack} from 'models';

import {DBConnection} from './DBConnection';

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
    return rows[0];
  }

  public async findBy(fieldName: string, fieldValue: string, fields: string[]): Promise<TTrack[]> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM playlist_data WHERE ${fieldName}=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [fieldValue]);
    return rows;
  }

  public async checkRelation(id: string, playlistId: string) {
    const query = `SELECT * FROM playlist_track WHERE track_id=$1 AND playlist_id=$2;`;
    const {rows} = await DBConnection.getInstance().query(query, [id, playlistId]);
    return rows.length > 0;
  }
}
