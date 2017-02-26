// @flow

export default function typeToExpression(j: Object, typeAlias: Object): Object {
  if (typeAlias.type === 'Identifier') {
    if (typeAlias.name === 'Array') {
      return j.arrayExpression([]);
    }
    return j.identifier(typeAlias.name);
  }
  if (typeAlias.type === 'QualifiedTypeIdentifier') {
    return j.memberExpression(
      typeToExpression(j, typeAlias.qualification),
      typeToExpression(j, typeAlias.id),
    );
  }
  return j.identifier('unknown');
}
