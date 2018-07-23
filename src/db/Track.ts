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

  private differentFields: {[index: string]: string} = {
    albumId: 'album_id as "albumId"',
    artistId: 'artist_id as "artistId"',
  };

  public parseFields(fields: string[]) {
    return fields.map((field) => this.differentFields[field] || field);
  }

  public async findById(id: string, fields: string[]): Promise<TTrack> {
    const parsedFields = this.parseFields(fields);
    const fieldsString = parsedFields.join(', ');
    const query = `SELECT ${fieldsString} FROM track_data WHERE id=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [id]);
    return rows[0];
  }

  public async findBy(fieldName: string, fieldValue: string, fields: string[]): Promise<TTrack[]> {
    const parsedFields = this.parseFields(fields);
    const fieldsString = parsedFields.join(', ');
    const query = `SELECT ${fieldsString} FROM playlist_data WHERE ${fieldName}=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [fieldValue]);
    return rows;
  }
}
