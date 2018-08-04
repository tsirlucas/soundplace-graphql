import {GraphQLResolveInfo} from 'graphql';
import graphqlFields from 'graphql-fields';

export const TopLevelFields = (info: GraphQLResolveInfo) => {
  const nativeFields = ['__typename'];
  let fieldsObj = graphqlFields(info);
  let fields = Object.keys(fieldsObj);

  const pickIdsFrom = (idFields: string[]) => {
    const existentIdFields = idFields
      .filter((field) => {
        return fields.indexOf(field) >= 0;
      })
      .map((field) => `${field}Id`);

    fields = [...fields, ...existentIdFields];

    return methods;
  };

  const getId = () => {
    fields = [...fields, 'id'];
    return methods;
  };

  const getIdFor = (idFields: string[]) => {
    const existentIdFields = idFields.filter((field) => {
      return fields.indexOf(field) >= 0;
    });

    if (existentIdFields.length > 0) {
      fields = [...fields, 'id'];
    }

    return methods;
  };

  const inner = (path: string) => {
    fieldsObj = fieldsObj[path];
    fields = Object.keys(fieldsObj);
    return methods;
  };

  const methods = {
    get: () =>
      fields
        .filter((prop) => Object.keys(fieldsObj[prop] || {}).length === 0)
        .filter((field) => nativeFields.indexOf(field) < 0),
    inner,
    pickIdsFrom,
    getId,
    getIdFor,
  };

  return methods;
};
