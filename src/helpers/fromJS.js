// @flow
import getTypeAnnotationWithoutInterface from './getTypeAnnotationWithoutInterface';
import isImmutableType from './isImmutableType';
import typeToExpression from './typeToExpression';
import { endsWithInterface } from './withoutInterfaceSuffix';

function getParamTypeAnnotation(j, className, defaultValues) {
  if (defaultValues) {
    return j.typeAnnotation(
      j.genericTypeAnnotation(
        j.identifier(`$Diff<${className}Interface, typeof ${defaultValues}>`),
        null
      )
    );
  }
  return j.typeAnnotation(
    j.genericTypeAnnotation(
      j.identifier(`${className}Interface`),
      null
    )
  );
}

export default function fromJS(
  j: Object,
  className: string,
  defaultValues: string | null,
  referenceProps: Object[]
) {
  const jsonIdentifier = j.identifier('json');
  const stateIdentifier = j.identifier('state');
  const fromJSIdentifier = j.identifier('fromJS');
  const paramTypeAnnotation = getParamTypeAnnotation(
    j,
    className,
    defaultValues
  );
  const referenceInitializationStatements = referenceProps
    .filter((prop) => {
      const typeAlias = prop.value;
      if (isImmutableType(typeAlias)) {
        return false;
      } else if (typeAlias.id.name === 'Array') {
        return typeAlias.typeParameters &&
          typeAlias.typeParameters.params[0].type === 'GenericTypeAnnotation' &&
          endsWithInterface(typeAlias.typeParameters.params[0].id.name);
      } else if (endsWithInterface(prop.value.id.name)) {
        return true;
      }
      return false;
    })
    .map((prop) => {
      let valueExpression;
      const typeAlias = prop.value;
      const propExpression = j.memberExpression(
        j.identifier('state'),
        j.identifier(prop.key.name)
      );

      if (typeAlias.id.name === 'Array') {
        valueExpression = j.callExpression(
          j.memberExpression(
            propExpression,
            j.identifier('map')
          ),
          [
            j.arrowFunctionExpression(
              [
                j.identifier('item'),
              ],
              j.callExpression(
                j.memberExpression(j.identifier('item'), j.identifier('fromJS')),
                [j.identifier('item')]
              )
            ),
          ]
        );
      } else {
        const convertedProp = Object.assign(
          {},
          prop,
          { value: getTypeAnnotationWithoutInterface(j, prop.value) }
        );
        const typeExpression = typeToExpression(j, convertedProp.value.id);
        valueExpression = j.callExpression(
          j.memberExpression(typeExpression, j.identifier('fromJS')),
          [propExpression]
        );
      }

      return j.expressionStatement(
        j.assignmentExpression(
          '=',
          propExpression,
          valueExpression
        )
      );
    });

  const assignExpressions = [];
  if (defaultValues) {
    const assignExpression = j.variableDeclaration(
      'const',
      [
        j.variableDeclarator(
          j.identifier('state'),
          j.callExpression(
            j.memberExpression(j.identifier('Object'), j.identifier('assign')),
            [j.objectExpression([]), j.identifier(`default${className}Values`), j.identifier('json')]
          )
        ),
      ]
    );
    assignExpression.comments = [j.commentLine(' $FlowFixMe')];
    assignExpressions.push(assignExpression);
  }
  const param = Object.assign({}, jsonIdentifier, { typeAnnotation: paramTypeAnnotation });
  const func = j.functionExpression(
    null,
    [
      param,
    ],
    j.blockStatement(
      [
        ...assignExpressions,
        ...referenceInitializationStatements,
        j.returnStatement(
          j.newExpression(
            j.identifier(className),
            [
              j.callExpression(
                j.memberExpression(
                  j.identifier('Immutable'),
                  fromJSIdentifier
                ),
                [
                  defaultValues ? stateIdentifier : jsonIdentifier,
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
