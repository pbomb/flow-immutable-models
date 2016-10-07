// @flow

function initializeReferencesStatements(j: Object, referenceProps: Object[]) {
  return referenceProps.map(prop =>
    j.expressionStatement(
      j.assignmentExpression(
        '=',
        j.identifier('state'),
        j.callExpression(
          j.memberExpression(
            j.identifier('state'),
            j.identifier('set')
          ),
          [
            j.literal(prop.key.name),
            j.newExpression(
              j.identifier(prop.value.id.name),
              []
            ),
          ]
        )
      )
    )
  );
}

export default function initialize(j: Object, referenceProps: Object[]) {
  const mapTypeAnnotation = j.typeAnnotation(
    j.genericTypeAnnotation(
      j.identifier('Immutable.Map'),
      j.typeParameterInstantiation(
        [j.stringTypeAnnotation(), j.anyTypeAnnotation()]
      )
    )
  );
  const blockStatements = [
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
        ),
      ]
    ),
    ...initializeReferencesStatements(j, referenceProps),
    j.returnStatement(
      j.identifier('state')
    ),
  ];
  const func = j.functionExpression(
    null,
    [],
    j.blockStatement(blockStatements)
  );
  func.returnType = mapTypeAnnotation;

  return j.methodDefinition(
    'method',
    j.identifier('initialize'),
    func,
    true
  );
}
