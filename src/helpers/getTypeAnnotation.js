// @flow
export default function getTypeAnnotation(j: Object, value: Object): Object {
  const type: string = value.type;

  switch (type) {
    case 'GenericTypeAnnotation':
      return j.genericTypeAnnotation(
        j.identifier(value.id.name),
        value.typeParameters
      );
    case 'NullableTypeAnnotation':
      return j.nullableTypeAnnotation(getTypeAnnotation(j, value.typeAnnotation));
    case 'NumberTypeAnnotation':
      return j.numberTypeAnnotation();
    case 'StringTypeAnnotation':
      return j.stringTypeAnnotation();
    default:
      throw new Error(`Don't know how to handle typeAnnotation ${type}`);
  }
}
