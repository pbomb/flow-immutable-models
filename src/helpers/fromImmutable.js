// @flow
export default function fromImmutable(j: Object, className: string) {
  const immutableStateIdentifier = j.identifier('immutableState');
  const fromImmutableIdentifier = j.identifier('fromImmutable');
  const mapTypeAnnotation = j.typeAnnotation(
    j.genericTypeAnnotation(
      j.identifier('Immutable.Map'),
      j.typeParameterInstantiation([j.stringTypeAnnotation(), j.anyTypeAnnotation()]),
    ),
  );
  const param = Object.assign({}, immutableStateIdentifier, { typeAnnotation: mapTypeAnnotation });
  const func = j.functionExpression(
    null,
    [param],
    j.blockStatement([
      j.returnStatement(j.newExpression(j.identifier(className), [immutableStateIdentifier])),
    ]),
  );
  func.returnType = j.typeAnnotation(j.genericTypeAnnotation(j.identifier(className), null));

  return j.methodDefinition('method', fromImmutableIdentifier, func, true);
}
