import {ApolloServer} from 'apollo-server-express';
import axios from 'axios';
import express from 'express';

import {environment} from 'src/environment';
import {schema} from 'src/schema';

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
    }
    next();
  } catch (e) {
    res.status(e.response.status).send(e.response.data);
  }
});

const server = new ApolloServer({schema});

server.applyMiddleware({app, cors: true});

export default app;
