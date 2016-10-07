// @flow
import getTypeAnnotation from './getTypeAnnotation';

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
  func.returnType = j.typeAnnotation(getTypeAnnotation(j, prop.value));

  return j.methodDefinition(
    'get',
    j.identifier(prop.key.name),
    func
  );
}
