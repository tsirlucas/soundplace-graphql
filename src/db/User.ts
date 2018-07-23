import {User as TUser} from 'models';

import {DBConnection} from './DBConnection';

export class User {
  private static instance: User;

  static getInstance() {
    if (!this.instance) {
      this.instance = new User();
    }

    return this.instance;
  }

  public async findAll(fields: string[]): Promise<TUser[]> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM user_data;`;
    const {rows} = await DBConnection.getInstance().query(query, []);
    return rows;
  }

  public async findById(id: string, fields: string[]): Promise<TUser> {
    const fieldsString = fields.join(', ');
    const query = `SELECT ${fieldsString} FROM user_data WHERE id=$1;`;
    const {rows} = await DBConnection.getInstance().query(query, [id]);
    return rows[0];
  }
}
