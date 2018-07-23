import {environment} from 'config';
import {Pool, PoolClient, QueryResult} from 'pg';

export class DBConnection {
  private static instance: DBConnection;
  private pool: Pool;

  private constructor() {
    const config = {
      host: environment.settings.dbEndpoint,
      database: environment.settings.dbName,
      user: environment.secrets.dbUser,
      password: environment.secrets.dbPassword,
      ssl: {
        ca: 'postgresql.pem',
      },
    };

    this.pool = new Pool(config);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DBConnection();
    }

    return this.instance;
  }

  public query(text: string, params: any[]): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      this.pool.query(text, params, (err, res) => {
        const duration = Date.now() - start;
        console.log('executed query', {text, duration});
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  public getClient(callback: (client: PoolClient) => Promise<any>) {
    this.pool.connect(async (err, client, done) => {
      try {
        if (err) throw err;
        await callback(client);
      } catch (e) {
        throw e;
      } finally {
        done();
      }
    });
  }
}
