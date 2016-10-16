// @flow
import getTypeAnnotationWithoutInterface from './getTypeAnnotationWithoutInterface';

export default function setterBody(
  j: Object,
  prop: Object,
  modelTypeAnnotation: Object,
  className: string
) {

  function capitalize(str: string) {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
  }
  const propName = prop.key.name;
  const typeAnnotation = j.typeAnnotation(getTypeAnnotationWithoutInterface(j, prop.value));
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
