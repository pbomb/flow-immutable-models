// @flow
import isModelTypeReference from './isModelTypeReference';

function getReturnObjectProp(j: Object, prop: Object) {
  const propName: string = prop.key.name;
  const typeAlias: Object = prop.value;
  const isReference = isModelTypeReference(typeAlias);
  const memberExpression = j.memberExpression(
    j.identifier('this'),
    j.identifier(propName),
  );
  let valueExpression;
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
  const alias = typeAlias.type === 'NullableTypeAnnotation' ? typeAlias.typeAnnotation : typeAlias;
  if (alias.id && alias.id.name === 'Array') {
    let toArrayExpression = j.callExpression(
      j.memberExpression(
        memberExpression,
        j.identifier('toArray')
      ),
      []
    );
    if (isReference) {
      toArrayExpression = j.callExpression(
        j.memberExpression(
          toArrayExpression,
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
    valueExpression = toArrayExpression;
  }
  if (valueExpression !== memberExpression && typeAlias.type === 'NullableTypeAnnotation') {
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
