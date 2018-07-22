import {environment} from 'config';
import {writeFile} from 'fs';
import {promisify} from 'util';

import app from 'src';

const fs_writeFile = promisify(writeFile);

interface AddressInfoWithPort {
  port: number;
}

const parsedPem = (environment.secrets.dbPem as string).replace(/"/g, '').replace(/\\n/g, '\n');

fs_writeFile('postgresql.pem', parsedPem, {encoding: 'utf8'})
  .then(() => {
    const httpServer = app.listen(process.env.PORT || 3000, (error: Error) => {
      if (error) {
        console.error(error);
      } else {
        const address = httpServer.address() as AddressInfoWithPort;
        console.info(
          `==> 🌎 Listening on ${address.port}. Open up http://localhost:${
            address.port
          }/ in your browser.`,
        );
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });
