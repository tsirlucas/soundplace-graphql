
declare module 'graphql-fields' {
  import {GraphQLInputField} from '../../node_modules/@types/graphql';

  export default (arg: GraphQLInputField) => any;
}
