import {environment} from 'config';
import cors from 'cors';
import express from 'express';

const app = express();

app
  .use(cors())
  .options('*', cors())
  .use(async (req, res, next) => {
    try {
      const {authorization} = req.headers;
      const {status, data} = await axios.get(`${environment.settings.authEndpoint}/jwt/verify`, {
        headers: {
          Authorization: authorization,
        },
      });

      if (status === 200) {
        res.locals.userId = data.userId;
        next();
      } else {
        res.sendStatus(status);
      }
    } catch (e) {
      throw e;
    }
  })
  .get('/', (_req, res) => res.send('Working ;)'))
  .use('/api', dataRouter)
  .use('/subscription', subscriptionRouter);

export default app;
