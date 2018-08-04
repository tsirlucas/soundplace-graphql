import {DBConnection} from 'src/db/DBConnection';
import {Playlist as TPlaylist, Track as TTrack} from 'src/models';

import {Cover} from './Cover';

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
    let {rows} = await DBConnection.getInstance().query(query, []);
    const ids = rows.map((row: TPlaylist) => row.id);
    const covers = await Cover.getInstance().batchFindBy('playlist_id', ids, ['*']);
    rows = rows.map((row: TPlaylist, index) => {
      row.cover = covers[index];
      return row;
    });
    return rows;
  }

  public async findById(id: string, fields: string[]): Promise<TPlaylist> {
    const parsedFields = this.parseFields(fields);
    const fieldsString = parsedFields.join(', ');
    const query = `SELECT ${fieldsString} FROM playlist_data WHERE id=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [id]);
    const cover = await Cover.getInstance().findBy('playlist_id', id, ['*']);
    const playlist = rows[0] as TPlaylist;
    playlist.cover = cover;
    return playlist;
  }

  public async findBy(
    fieldName: string,
    fieldValue: string,
    fields: string[],
  ): Promise<TPlaylist[]> {
    const parsedFields = this.parseFields(fields);
    const fieldsString = parsedFields.join(', ');
    const query = `SELECT ${fieldsString} FROM playlist_data WHERE ${fieldName}=$1;`;
    let {rows} = await DBConnection.getInstance().query(query, [fieldValue]);
    const ids = rows.map((row: TPlaylist) => row.id);
    const covers = await Cover.getInstance().batchFindBy('playlist_id', ids, ['*']);
    rows = rows.map((row: TPlaylist, index) => {
      row.cover = covers[index];
      return row;
    });

    return rows;
  }

  public async findTracks(id: string, fields: string[]): Promise<TTrack[]> {
    const parsedFields = fields.map((field) => `t.${field}`);
    const fieldsString = parsedFields.join(', ');

    const query = `SELECT ${fieldsString}
    FROM playlist_data as p
    INNER JOIN playlist_track as pt
    ON pt.playlist_id = p.id
    INNER JOIN track_data as t
    ON pt.track_id = t.id
    WHERE pt.playlist_id=$1`;

    let {rows} = await DBConnection.getInstance().query(query, [id]);
    const ids = rows.map((row: TPlaylist) => row.id);
    const covers = await Cover.getInstance().batchFindBy('track_id', ids, ['*']);
    rows = rows.map((row: TPlaylist, index) => {
      row.cover = covers[index];
      return row;
    });

    return rows;
  }

  public async batchFindTracks(ids: string[], fields: string[]): Promise<TTrack[]> {
    try {
      const parsedFields = fields.map((field) => `t.${field}`);
      const fieldsString = parsedFields.join(', ');

      const query = `SELECT ${fieldsString}, pt.playlist_id as "playlistId"
                    FROM playlist_data as p
                    INNER JOIN playlist_track as pt
                    ON pt.playlist_id = p.id
                    INNER JOIN track_data as t
                    ON pt.track_id = t.id
                    WHERE pt.playlist_id= ANY ($1)`;

      let {rows} = await DBConnection.getInstance().query(query, [[ids]]);
      const covers = await Cover.getInstance().batchFindBy('track_id', ids, ['*']);
      rows = rows.map((row: TTrack, index) => {
        row.cover = covers[index];
        return row;
      });
      return rows;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  public async checkRelation(playlistId: string, userId: string) {
    const query = `SELECT user_id FROM playlist_data WHERE id=$1 AND user_id=$2;`;
    const {rows} = await DBConnection.getInstance().query(query, [playlistId, userId]);
    return rows.length > 0;
  }
}
