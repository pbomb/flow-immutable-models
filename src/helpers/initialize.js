// @flow
import getNonClassTypes from './getNonClassTypes';
import isImmutableType from './isImmutableType';
import typeToExpression from './typeToExpression';

function initializeReferencesStatements(j: Object, referenceProps: Object[], root: Object) {
  const nonClassTypes = getNonClassTypes(j, root);
  return referenceProps
    .filter(prop => nonClassTypes.indexOf(prop.value.id.name) === -1)
    .map((prop) => {
      let valueExpression;
      const typeAlias = prop.value;
      const typeExpression = typeToExpression(j, typeAlias.id);
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

export default function initialize(
  j: Object,
  referenceProps: Object[],
  initialValues: string | null,
  root: Object
) {
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
            initialValues ? [j.identifier(initialValues)] : []
          )
        ),
      ]
    ),
    ...initializeReferencesStatements(j, referenceProps, root),
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
