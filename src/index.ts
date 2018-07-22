import {ApolloServer, gql} from 'apollo-server-express';
import axios from 'axios';
import {environment} from 'config';
import express from 'express';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const myGraphQLSchema = {typeDefs, resolvers};

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

const server = new ApolloServer(myGraphQLSchema);

server.applyMiddleware({app, cors: true});

export default app;
