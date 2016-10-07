// @flow
export default function initialize(j: Object, prop: Object, props: Object[]) {
  const mapTypeAnnotation = j.typeAnnotation(
    j.genericTypeAnnotation(
      j.identifier('Immutable.Map'),
      j.typeParameterInstantiation(
        [j.stringTypeAnnotation(), j.anyTypeAnnotation()]
      )
    )
  );
  const func = j.functionExpression(
    null,
    [],
    j.blockStatement(
      [
        j.variableDeclaration(
          'const',
          [
            j.variableDeclarator(
              j.identifier('state'),
              j.callExpression(
                j.memberExpression(
                  j.identifier('Immutable'),
                  j.identifier('Map')
                ),
                []
              )
            )
          ]
        ),
        j.returnStatement(
          j.identifier('state')
        )
      ]
    )
  );
  func.returnType = mapTypeAnnotation;

  return j.methodDefinition(
    'method',
    j.identifier('initialize'),
    func,
    true
  );
}
