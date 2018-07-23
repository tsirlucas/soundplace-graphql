import {Playlist as TPlaylist, Track} from 'models';

import {DBConnection} from './DBConnection';

export class Playlist {
  private static instance: Playlist;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Playlist();
    }

    return this.instance;
  }

  private differentFields: {[index: string]: string} = {
    userId: 'user_id as "userId"',
  };

  private parseFields(fields: string[]) {
    return fields.map((field) => this.differentFields[field] || field);
  }

  public async findAll(fields: string[]): Promise<TPlaylist[]> {
    const parsedFields = this.parseFields(fields);
    const fieldsString = parsedFields.join(', ');
    const query = `SELECT ${fieldsString} FROM playlist_data;`;
    const {rows} = await DBConnection.getInstance().query(query, []);
    return rows;
  }

  public async findById(id: string, fields: string[]): Promise<TPlaylist> {
    const parsedFields = this.parseFields(fields);
    const fieldsString = parsedFields.join(', ');
    const query = `SELECT ${fieldsString} FROM playlist_data WHERE id=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [id]);
    return rows[0];
  }

  public async findBy(
    fieldName: string,
    fieldValue: string,
    fields: string[],
  ): Promise<TPlaylist[]> {
    const parsedFields = this.parseFields(fields);
    const fieldsString = parsedFields.join(', ');
    const query = `SELECT ${fieldsString} FROM playlist_data WHERE ${fieldName}=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [fieldValue]);
    return rows;
  }

  public async findTracks(id: string, fields: string[]): Promise<Track[]> {
    const parsedFields = this.parseFields(fields).map((field) => `t.${field}`);
    const fieldsString = parsedFields.join(', ');

    const query = `SELECT ${fieldsString}
    FROM playlist_data as p
    INNER JOIN playlist_track as pt
    ON pt.playlist_id = p.id
    INNER JOIN track_data as t
    ON pt.track_id = t.id
    WHERE pt.playlist_id=$1`;

    const {rows} = await DBConnection.getInstance().query(query, [id]);
    return rows;
  }
}
