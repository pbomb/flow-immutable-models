// @flow

function isImmutableType(typeAlias: Object): boolean {
  if (typeAlias.id.type === 'QualifiedTypeIdentifier' && typeAlias.id.qualification.name === 'Immutable') {
    return true;
  }
  return false;
}

function fromTypeToExpression(j: Object, typeAlias: Object): Object {
  if (typeAlias.type === 'Identifier') {
    if (typeAlias.name === 'Array') {
      return j.arrayExpression([]);
    }
    return j.identifier(typeAlias.name);
  }
  if (typeAlias.type === 'QualifiedTypeIdentifier') {
    return j.memberExpression(
      fromTypeToExpression(j, typeAlias.qualification),
      fromTypeToExpression(j, typeAlias.id)
    );
  }
  return j.identifier('unknown');
}

function initializeReferencesStatements(j: Object, referenceProps: Object[]) {
  return referenceProps.map((prop) => {
    let valueExpression;
    const typeAlias = prop.value;
    const typeExpression = fromTypeToExpression(j, typeAlias.id);
    if (isImmutableType(typeAlias)) {
      valueExpression = j.callExpression(typeExpression, []);
    } else if (typeAlias.id.name === 'Array') {
      valueExpression = typeExpression;
    } else {
      valueExpression = j.newExpression(typeExpression, []);
    }

    return j.expressionStatement(
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
            valueExpression,
          ]
        )
      )
    );
  });
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
      'let',
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
    false
  );
}
