// @flow

import { withoutInterfaceSuffix } from './withoutInterfaceSuffix';

export default function getTypeAnnotationWithoutInterface(j: Object, value: Object): Object {
  const type: string = value.type;

  switch (type) {
    case 'GenericTypeAnnotation': {
      if (value.id.type === 'Identifier') {
        return j.genericTypeAnnotation(
          j.identifier(withoutInterfaceSuffix(value.id.name)),
          value.typeParameters
        );
      }
      if (value.id.type === 'QualifiedTypeIdentifier') {
        return j.genericTypeAnnotation(
          j.qualifiedTypeIdentifier(
            value.id.qualification,
            j.identifier(withoutInterfaceSuffix(value.id.id.name))
          ),
          j.typeParameterInstantiation(
            value.typeParameters.params.map(
              typeParam => getTypeAnnotationWithoutInterface(j, typeParam)
            )
          )
        );
      }
      return value;
    }
    case 'NullableTypeAnnotation':
      return j.nullableTypeAnnotation(getTypeAnnotationWithoutInterface(j, value.typeAnnotation));
    default:
      return value;
  }
}
