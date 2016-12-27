// @flow
import getTypeAnnotationWithoutModelType from './getTypeAnnotationWithoutModelType';
import capitalize from './capitalize';

export default function setterBody(
  j: Object,
  prop: Object,
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
          j.callExpression(
            j.memberExpression(
              j.thisExpression(),
              j.identifier('clone'),
            ),
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
            ],
          ),
        ),
      ],
    )
  );
  func.returnType = j.typeAnnotation(j.genericTypeAnnotation(j.identifier('this'), null));

  return j.methodDefinition(
    'method',
    j.identifier(`set${capitalize(propName)}`),
    func
  );
}
