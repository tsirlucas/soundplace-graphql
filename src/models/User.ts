import {DBUser} from 'src/models/DBUser';

export type User = {
  id: DBUser['id'];
  name: DBUser['name'];
  image: DBUser['image'];
};
