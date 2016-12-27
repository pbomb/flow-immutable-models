// @flow
import isModelTypeReference from './isModelTypeReference';
import { isArray, isObjectMap } from './flowTypes';

function toArrayExpression(j: Object, memberExpression: Object, isReference: boolean): Object {
  let arrayExpression = j.callExpression(
    j.memberExpression(
      memberExpression,
      j.identifier('toArray')
    ),
    []
  );
  if (isReference) {
    arrayExpression = j.callExpression(
      j.memberExpression(
        arrayExpression,
        j.identifier('map')
      ),
      [
        j.arrowFunctionExpression(
          [
            j.identifier('item'),
          ],
          j.callExpression(
            j.memberExpression(j.identifier('item'), j.identifier('toJS')),
            []
          )
        ),
      ]
    );
  }
  return arrayExpression;
}

function toObjectExpression(j: Object, memberExpression: Object, isReference: boolean) {
  let mappedExpression = memberExpression;
  if (isReference) {
    mappedExpression = j.callExpression(
      j.memberExpression(
        memberExpression,
        j.identifier('map')
      ),
      [
        j.arrowFunctionExpression(
          [
            j.identifier('item'),
          ],
          j.callExpression(
            j.memberExpression(j.identifier('item'), j.identifier('toJS')),
            []
          )
        ),
      ]
    );
  }
  return j.callExpression(
    j.memberExpression(
      mappedExpression,
      j.identifier('toObject')
    ),
    []
  );
}

function getReturnObjectProp(j: Object, prop: Object) {
  const propName: string = prop.key.name;
  const typeAlias: Object = prop.value;
  const isReference = isModelTypeReference(typeAlias);
  const memberExpression = j.memberExpression(
    j.identifier('this'),
    j.identifier(propName),
  );
  let valueExpression = memberExpression;

  if (isReference) {
    valueExpression = j.callExpression(
      j.memberExpression(
        memberExpression,
        j.identifier('toJS')
      ),
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
  if (valueExpression !== memberExpression && isNullable) {
    valueExpression = j.conditionalExpression(
      memberExpression,
      valueExpression,
      memberExpression
    );
  }
  return j.property('init', j.identifier(propName), valueExpression);
}

export default function toJS(
  j: Object,
  className: string,
  props: Object[]
) {
  const toJSIdentifier = j.identifier('toJS');
  const modelTypeAnnotation = j.typeAnnotation(
    j.genericTypeAnnotation(
      j.identifier(`${className}ModelType`),
      null
    )
  );
  const returnObjProps = props.map(prop => getReturnObjectProp(j, prop));
  const func = j.functionExpression(
    null,
    [],
    j.blockStatement(
      [
        j.returnStatement(
          j.objectExpression(returnObjProps)
        ),
      ]
    )
  );
  func.returnType = modelTypeAnnotation;
  return j.methodDefinition(
    'method',
    toJSIdentifier,
    func,
    false
  );
}
