// @flow
import getTypeAnnotationWithoutInterface from './getTypeAnnotationWithoutModelType';
import typeToExpression from './typeToExpression';
import { endsWithModelType, withoutModelTypeSuffix } from './withoutModelTypeSuffix';
import { isArray, isImmutableType, isObjectMap } from './flowTypes';

function getParamTypeAnnotation(j: Object, className: string, defaultValues: string | null) {
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

function modelMapFn(j: Object, nonModelType: string): Object {
  return j.arrowFunctionExpression(
    [
      j.identifier('item'),
    ],
    j.callExpression(
      j.memberExpression(j.identifier(nonModelType), j.identifier('fromJS')),
      [j.identifier('item')]
    )
  );
}

function initializeArray(
  j: Object,
  typeAlias: Object,
  propExpression: Object
): Object {
  const firstParamType = typeAlias.typeParameters.params[0];
  const arrayType = firstParamType.type;
  const createListExpression = j.callExpression(
    j.memberExpression(j.identifier('Immutable'), j.identifier('List')),
    [propExpression]
  );
  let valueExpression = createListExpression;
  if (arrayType === 'GenericTypeAnnotation') {
    const modelType = firstParamType.id.name;
    const nonModelType = withoutModelTypeSuffix(modelType);
    if (nonModelType !== modelType) {
      valueExpression = j.callExpression(
        j.memberExpression(
          createListExpression,
          j.identifier('map')
        ),
        [
          modelMapFn(j, nonModelType),
        ]
      );
    }
  }
  return valueExpression;
}

function initializeObject(
  j: Object,
  typeAlias: Object,
  propExpression: Object
): Object {
  let valueExpression = j.callExpression(
    j.memberExpression(
      j.identifier('Immutable'),
      j.identifier('Map')
    ),
    [
      propExpression,
    ]
  );
  const propIndexer = typeAlias.indexers[0];
  const modelType = propIndexer && propIndexer.value.id && propIndexer.value.id.name;
  const nonModelType = modelType && withoutModelTypeSuffix(modelType);
  if (modelType !== nonModelType) {
    valueExpression = j.callExpression(
      j.memberExpression(valueExpression, j.identifier('map')),
      [
        modelMapFn(j, nonModelType),
      ]
    );
  }
  return valueExpression;
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
      const isNullable = typeAlias.type === 'NullableTypeAnnotation';
      const alias = isNullable ? typeAlias.typeAnnotation : typeAlias;
      if (isImmutableType(alias)) {
        return false;
      }
      return isArray(alias)
        || isObjectMap(alias)
        || endsWithModelType(alias.id && alias.id.name);
    })
    .map((prop) => {
      let valueExpression;
      const typeAlias = prop.value;
      const isNullable = typeAlias.type === 'NullableTypeAnnotation';
      const alias = isNullable ? typeAlias.typeAnnotation : typeAlias;
      const propExpression = j.memberExpression(
        j.identifier('state'),
        j.identifier(prop.key.name)
      );

      if (isArray(alias)) {
        valueExpression = initializeArray(j, alias, propExpression);
      } else if (isObjectMap(alias)) {
        valueExpression = initializeObject(j, alias, propExpression);
      } else {
        const convertedProp = Object.assign(
          {},
          prop,
          { value: getTypeAnnotationWithoutInterface(j, alias) }
        );
        const typeExpression = typeToExpression(j, convertedProp.value.id);
        valueExpression = j.callExpression(
          j.memberExpression(typeExpression, fromJSIdentifier),
          [propExpression]
        );
      }
      if (isNullable) {
        valueExpression = j.conditionalExpression(
          propExpression,
          valueExpression,
          propExpression
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
  const stateObjectTypeAnnotation = j.typeAnnotation(j.genericTypeAnnotation(j.identifier('Object'), null));
  const stateVariableIdentifier = Object.assign({}, j.identifier('state'), { typeAnnotation: stateObjectTypeAnnotation });
  const stateVariable = j.variableDeclarator(
    stateVariableIdentifier,
    j.callExpression(
      j.memberExpression(j.identifier('Object'), j.identifier('assign')),
      argumentArray
    )
  );
  const assignExpression = j.variableDeclaration(
    'const',
    [
      stateVariable,
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
                j.memberExpression(j.identifier('Immutable'), j.identifier('Map')),
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
