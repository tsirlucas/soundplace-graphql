import graphqlFields from 'graphql-fields';

export const TopLevelFields = (info: any) => {
  const fieldsObj = graphqlFields(info);
  let fields = Object.keys(fieldsObj);

  const pickIdsFrom = (idFields: string[]) => {
    const existentIdFields = idFields
      .filter((field) => {
        console.log(field, fields.indexOf(field) >= 0);
        return fields.indexOf(field) >= 0;
      })
      .map((field) => `${field}Id`);

    fields = [...fields, ...existentIdFields];

    return {
      get: () => fields.filter((prop) => Object.keys(fieldsObj[prop] || {}).length === 0),
    };
  };

  return {
    get: () => fields.filter((prop) => Object.keys(fieldsObj[prop] || {}).length === 0),
    pickIdsFrom,
  };
};
