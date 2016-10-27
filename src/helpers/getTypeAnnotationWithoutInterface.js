// @flow

import { withoutInterfaceSuffix } from './withoutInterfaceSuffix';

export default function getTypeAnnotationWithoutInterface(
  j: Object,
  value: Object,
  convertToImmutable: boolean = false
): Object {
  const type: string = value.type;

  switch (type) {
    case 'GenericTypeAnnotation': {
      if (value.id.type === 'Identifier') {
        const nameWithoutSuffix = withoutInterfaceSuffix(value.id.name);
        let typeId;
        if (nameWithoutSuffix === 'Array' && convertToImmutable) {
          typeId = j.qualifiedTypeIdentifier(
            j.identifier('Immutable'),
            j.identifier('List')
          );
        } else {
          typeId = j.identifier(nameWithoutSuffix);
        }
        return j.genericTypeAnnotation(
          typeId,
          value.typeParameters
            ? j.typeParameterInstantiation(
              value.typeParameters.params.map(
                typeParam => getTypeAnnotationWithoutInterface(j, typeParam)
              )
            )
            : null
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
