import {DBCover} from 'models';

import {DBConnection} from './DBConnection';

export class Cover {
  private static instance: Cover;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Cover();
    }

    return this.instance;
  }

  public async findBy(fieldName: string, fieldValue: string, fields: string[]): Promise<DBCover> {
    const query = `SELECT ${fields.join(', ')} FROM cover_data WHERE ${fieldName}=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [fieldValue]);
    return rows[0];
  }

  public async batchFindBy(
    fieldName: string,
    fieldValues: string[],
    fields: string[],
  ): Promise<DBCover[]> {
    const query = `SELECT ${fields.join(', ')} FROM cover_data WHERE ${fieldName}= ANY($1);`;
    const {rows} = await DBConnection.getInstance().query(query, [[fieldValues]]);
    return rows;
  }
}
