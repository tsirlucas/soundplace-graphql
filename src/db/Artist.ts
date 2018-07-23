import {Artist as TArtist} from 'models';

import {DBConnection} from './DBConnection';

export class Artist {
  private static instance: Artist;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Artist();
    }

    return this.instance;
  }

  public async findById(id: string, fields: string[]): Promise<TArtist> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM artist_data WHERE id=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [id]);
    return rows[0];
  }

  public async findBy(fieldName: string, fieldValue: string, fields: string[]): Promise<TArtist[]> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM artist_data WHERE ${fieldName}=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [fieldValue]);
    return rows;
  }

  public async batch(ids: string[], fields: string[]): Promise<TArtist[]> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM artist_data WHERE id = ANY ($1);`;
    const {rows} = await DBConnection.getInstance().query(query, [[ids]]);
    return rows;
  }
}
