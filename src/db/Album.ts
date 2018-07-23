import {Album as TAlbum} from 'models';

import {DBConnection} from './DBConnection';

export class Album {
  private static instance: Album;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Album();
    }

    return this.instance;
  }

  public async findById(id: string, fields: string[]): Promise<TAlbum> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM album_data WHERE id=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [id]);
    return rows[0];
  }

  public async findBy(fieldName: string, fieldValue: string, fields: string[]): Promise<TAlbum[]> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM album_data WHERE ${fieldName}=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [fieldValue]);
    return rows;
  }
}
