// @flow
import getTypeAnnotationWithoutModelType from './getTypeAnnotationWithoutModelType';
import capitalize from './capitalize';

export default function setterBody(
  j: Object,
  prop: Object,
  modelTypeAnnotation: Object,
  className: string,
) {

  const propName = prop.key.name;
  const typeAnnotation = j.typeAnnotation(getTypeAnnotationWithoutModelType(j, prop.value, true));
  const param = Object.assign(j.identifier(propName), { typeAnnotation });
  const func = j.functionExpression(
    null,
    [
      param,
    ],
    j.blockStatement(
      [
        j.returnStatement(
          j.newExpression(
            j.identifier(className),
            [
              j.callExpression(
                j.memberExpression(
                  j.memberExpression(
                    j.thisExpression(),
                    j.identifier('_state')
                  ),
                  j.identifier('set')
                ),
                [
                  j.literal(propName),
                  j.identifier(propName),
                ]
              ),
            ]
          )
        ),
      ],
    )
  );
  func.returnType = modelTypeAnnotation;

  return j.methodDefinition(
    'method',
    j.identifier(`set${capitalize(propName)}`),
    func
  );
}
