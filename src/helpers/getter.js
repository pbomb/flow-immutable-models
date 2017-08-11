// @flow
import getTypeAnnotationWithoutModelType from './getTypeAnnotationWithoutModelType';

export default function getter(j: Object, prop: Object) {
  const func = j.blockStatement([
    j.returnStatement(
      j.callExpression(
        j.memberExpression(
          j.memberExpression(j.thisExpression(), j.identifier('_state')),
          j.identifier('get')
        ),
        [j.stringLiteral(prop.key.name)]
      )
    ),
  ]);
  let returnType = getTypeAnnotationWithoutModelType(j, prop.value, true);
  if (prop.optional && returnType.type !== 'NullableTypeAnnotation') {
    returnType = j.nullableTypeAnnotation(returnType);
  }

  const className = j.classMethod('get', j.identifier(prop.key.name), [], func);
  className.returnType = j.typeAnnotation(returnType);

  return className;
}
