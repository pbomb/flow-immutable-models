// @flow
import getTypeAnnotationWithoutInterface from './getTypeAnnotationWithoutModelType';
import isImmutableType from './isImmutableType';
import typeToExpression from './typeToExpression';
import { endsWithModelType, withoutModelTypeSuffix } from './withoutModelTypeSuffix';

function getParamTypeAnnotation(j, className, defaultValues) {
  if (defaultValues) {
    return j.typeAnnotation(
      j.genericTypeAnnotation(
        j.identifier(`$Diff<${className}ModelType, typeof ${defaultValues}>`),
        null
      )
    );
  }
  return j.typeAnnotation(
    j.genericTypeAnnotation(
      j.identifier(`${className}ModelType`),
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
          endsWithModelType(typeAlias.typeParameters.params[0].id.name);
      } else if (endsWithModelType(prop.value.id.name)) {
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
        const modelType = typeAlias.typeParameters.params[0].id.name;
        const nonModelType = withoutModelTypeSuffix(modelType);
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
                j.memberExpression(j.identifier(nonModelType), j.identifier('fromJS')),
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
  let argumentArray;
  if (defaultValues) {
    argumentArray = [j.objectExpression([]), j.identifier(`default${className}Values`), j.identifier('json')];
  } else {
    argumentArray = [j.objectExpression([]), j.identifier('json')];
  }
  const assignExpression = j.variableDeclaration(
    'const',
    [
      j.variableDeclarator(
        j.identifier('state'),
        j.callExpression(
          j.memberExpression(j.identifier('Object'), j.identifier('assign')),
          argumentArray
        )
      ),
    ]
  );
  if (defaultValues) {
    assignExpression.comments = [j.commentLine(' $FlowFixMe')];
  }
  assignExpressions.push(assignExpression);
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
            j.identifier('this'),
            [
              j.callExpression(
                j.memberExpression(
                  j.identifier('Immutable'),
                  fromJSIdentifier
                ),
                [stateIdentifier]
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
