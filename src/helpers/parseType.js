export default function parseType<T: Object | string>(td: T): T {
  if (typeof td === 'string') {
    return td;
  }
  const typeDef = Object.assign({}, td);
  delete typeDef.start;
  delete typeDef.end;
  delete typeDef.loc;
  delete typeDef.extra;

  if (typeDef.id) {
    typeDef.id = parseType(typeDef.id);
  }
  if (typeDef.key) {
    typeDef.key = parseType(typeDef.key);
  }
  if (typeDef.value) {
    typeDef.value = parseType(typeDef.value);
  }

  if (typeDef.types) {
    typeDef.types = typeDef.types.map(parseType);
  }
  if (typeDef.properties) {
    typeDef.properties = typeDef.properties.map(parseType);
  }

  return typeDef;
}
