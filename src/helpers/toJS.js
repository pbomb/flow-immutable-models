// @flow
import isModelTypeReference from './isModelTypeReference';
import { isArray, isObjectMap } from './flowTypes';

function toArrayExpression(j: Object, memberExpression: Object, isReference: boolean): Object {
  let arrayExpression = j.callExpression(
    j.memberExpression(memberExpression, j.identifier('toArray')),
    []
  );
  if (isReference) {
    arrayExpression = j.callExpression(j.memberExpression(arrayExpression, j.identifier('map')), [
      j.arrowFunctionExpression(
        [j.identifier('item')],
        j.callExpression(j.memberExpression(j.identifier('item'), j.identifier('toJS')), [])
      ),
    ]);
  }
  return arrayExpression;
}

function toObjectExpression(j: Object, memberExpression: Object, isReference: boolean) {
  let mappedExpression = memberExpression;
  if (isReference) {
    mappedExpression = j.callExpression(j.memberExpression(memberExpression, j.identifier('map')), [
      j.arrowFunctionExpression(
        [j.identifier('item')],
        j.callExpression(j.memberExpression(j.identifier('item'), j.identifier('toJS')), [])
      ),
    ]);
  }
  return j.callExpression(j.memberExpression(mappedExpression, j.identifier('toObject')), []);
}

function getReturnObjectProp(j: Object, prop: Object) {
  const propName: string = prop.key.name;
  const typeAlias: Object = prop.value;
  const isReference = isModelTypeReference(typeAlias);
  const memberExpression = j.memberExpression(j.identifier('this'), j.identifier(propName));
  let valueExpression = memberExpression;

  if (isReference) {
    valueExpression = j.callExpression(
      j.memberExpression(memberExpression, j.identifier('toJS')),
      []
    );
  } else {
    valueExpression = memberExpression;
  }
  const isNullable = typeAlias.type === 'NullableTypeAnnotation';
  const alias = isNullable ? typeAlias.typeAnnotation : typeAlias;
  if (isArray(alias)) {
    valueExpression = toArrayExpression(j, memberExpression, isReference);
  } else if (isObjectMap(alias)) {
    valueExpression = toObjectExpression(j, memberExpression, isReference);
  }
  if (valueExpression !== memberExpression && (isNullable || prop.optional)) {
    valueExpression = j.conditionalExpression(memberExpression, valueExpression, memberExpression);
  }
  return valueExpression;
}

export default function toJS(j: Object, className: string, props: Object[]) {
  const toJSIdentifier = j.identifier('toJS');
  const modelTypeAnnotation = j.typeAnnotation(
    j.genericTypeAnnotation(j.identifier(`${className}ModelType`), null)
  );
  const maybeProps = props.filter(prop => prop.optional);
  const notMaybeProps = props.filter(prop => !prop.optional);
  const objExpression = j.objectExpression(
    notMaybeProps.map(prop =>
      j.objectProperty(j.identifier(prop.key.name), getReturnObjectProp(j, prop))
    )
  );
  let blockStatements: Array<Object>;
  if (maybeProps.length === 0) {
    blockStatements = [j.returnStatement(objExpression)];
  } else {
    blockStatements = [
      j.variableDeclaration('const', [
        j.variableDeclarator(
          Object.assign({}, j.identifier('js'), {
            typeAnnotation: modelTypeAnnotation,
          }),
          objExpression
        ),
      ]),
      ...maybeProps.map(maybeProp => {
        const assignment = j.assignmentExpression(
          '=',
          j.memberExpression(j.identifier('js'), j.identifier(maybeProp.key.name)),
          getReturnObjectProp(j, maybeProp)
        );
        return j.ifStatement(
          j.binaryExpression(
            '!=',
            j.memberExpression(j.identifier('this'), j.identifier(maybeProp.key.name)),
            j.identifier('null')
          ),
          j.blockStatement([j.expressionStatement(assignment)]),
          null
        );
      }),
      j.returnStatement(j.identifier('js')),
    ];
  }
  const returnType = modelTypeAnnotation;
  const classMethod = j.classMethod(
    'method',
    toJSIdentifier,
    [],
    j.blockStatement(blockStatements)
  );
  classMethod.returnType = returnType;

  return classMethod;
}
