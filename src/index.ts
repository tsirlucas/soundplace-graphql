import {ApolloServer} from 'apollo-server-express';
import axios from 'axios';
import {environment} from 'config';
import {Dataloaders} from 'dataloaders';
import express, {Response} from 'express';
import {schema} from 'schema';

const app = express();

app.use(async (req, res, next) => {
  try {
    if (req.method !== 'GET') {
      const {authorization} = req.headers;
      const {data} = await axios.get(`${environment.settings.authEndpoint}/jwt/verify`, {
        headers: {
          Authorization: authorization || null,
        },
      });

      res.locals.userId = data.userId;
      res.locals.dataloaders = new Dataloaders();
    }
    next();
  } catch (e) {
    res.status(e.response.status).send(e.response.data);
  }
});

const server = new ApolloServer({
  schema,
  context: ({res}: {res: Response}) => ({
    userId: res.locals.userId,
    dataloaders: res.locals.dataloaders,
  }),
});

server.applyMiddleware({app, cors: true});

export default app;
