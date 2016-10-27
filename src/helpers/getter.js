// @flow
import getTypeAnnotationWithoutModelType from './getTypeAnnotationWithoutModelType';

export default function getter(j: Object, prop: Object) {
  const func = j.functionExpression(null, [],
    j.blockStatement(
      [
        j.returnStatement(
          j.callExpression(
            j.memberExpression(
              j.memberExpression(
                j.thisExpression(),
                j.identifier('_state')
              ),
              j.identifier('get')
            ),
            [
              j.literal(prop.key.name),
            ]
          )
        ),
      ]
    )
  );
  func.returnType = j.typeAnnotation(getTypeAnnotationWithoutModelType(j, prop.value, true));

  return j.methodDefinition(
    'get',
    j.identifier(prop.key.name),
    func
  );
}
