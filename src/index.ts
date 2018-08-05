import {ApolloServer} from 'apollo-server-express';
import axios from 'axios';
import express, {Request} from 'express';
import {createServer} from 'http';

import {Dataloaders} from 'src/dataloaders';
import {environment} from 'src/environment';
import {schema} from 'src/schema';

const app = express();

const context = async ({req, connection}: {req: Request; connection: any}) => {
  let authorization: string | undefined;

  if (req && req.method !== 'GET') {
    authorization = req.headers.authorization;
  } else if (connection && connection.context) {
    authorization = connection.context.authorization;
  }

  const {data} = await axios.get(`${environment.settings.authEndpoint}/jwt/verify`, {
    headers: {
      Authorization: authorization || null,
    },
  });

  return {
    userId: data.userId,
    dataloaders: new Dataloaders(),
  };
};

const server = new ApolloServer({
  schema,
  context,
  introspection: true,
  playground: true,
});

server.applyMiddleware({app, cors: true});

const httpServer = createServer(app);

server.installSubscriptionHandlers(httpServer);

export default httpServer;
