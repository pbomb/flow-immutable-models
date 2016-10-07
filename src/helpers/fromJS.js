// @flow
export default function fromJS(j: Object, objectTypeAnnotation: Object, className: string) {
  const stateIdentifier = j.identifier('state');
  const fromJSIdentifier = j.identifier('fromJS');
  const param = Object.assign({}, stateIdentifier, { typeAnnotation: objectTypeAnnotation });
  const func = j.functionExpression(
    null,
    [
      param,
    ],
    j.blockStatement(
      [
        j.returnStatement(
          j.callExpression(
            j.memberExpression(
              j.thisExpression(),
              j.identifier('fromImmutable')
            ),
            [
              j.callExpression(
                j.memberExpression(
                  j.identifier('Immutable'),
                  fromJSIdentifier
                ),
                [
                  stateIdentifier,
                ]
              ),
            ]
          )
        ),
      ]
    )
  );
  func.returnType = j.typeAnnotation(j.genericTypeAnnotation(j.identifier(className), null));

  return j.methodDefinition(
    'method',
    fromJSIdentifier,
    func,
    true
  );
}
