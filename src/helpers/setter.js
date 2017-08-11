// @flow
import getTypeAnnotationWithoutModelType from './getTypeAnnotationWithoutModelType';
import capitalize from './capitalize';

export default function setterBody(j: Object, prop: Object) {
  const propName = prop.key.name;
  let propType = getTypeAnnotationWithoutModelType(j, prop.value, true);
  if (prop.optional && propType.type !== 'NullableTypeAnnotation') {
    propType = j.nullableTypeAnnotation(propType);
  }
  const typeAnnotation = j.typeAnnotation(propType);
  const param = Object.assign(j.identifier(propName), { typeAnnotation });
  const func = j.blockStatement([
    j.returnStatement(
      j.callExpression(j.memberExpression(j.thisExpression(), j.identifier('clone')), [
        j.callExpression(
          j.memberExpression(
            j.memberExpression(j.thisExpression(), j.identifier('_state')),
            j.identifier('set')
          ),
          [j.stringLiteral(propName), j.identifier(propName)]
        ),
      ])
    ),
  ]);

  const className = j.classMethod(
    'method',
    j.identifier(`set${capitalize(propName)}`),
    [param],
    func
  );
  className.returnType = j.typeAnnotation(j.genericTypeAnnotation(j.identifier('this'), null));

  return className;
}
