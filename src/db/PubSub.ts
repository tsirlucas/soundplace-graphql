import {PostgresPubSub} from 'graphql-postgres-subscriptions';

import {DBConnection} from './DBConnection';

export class PubSub {
  private static instance: PubSub;
  public pubsub: any;

  private constructor() {
    const client = DBConnection.getInstance().getClientWithoutPool();
    client.connect();
    this.pubsub = new PostgresPubSub({client});
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new PubSub();
    }

    return this.instance;
  }
}
