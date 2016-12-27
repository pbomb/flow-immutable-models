// @flow

export function isArray(typeAlias: Object): boolean {
  return typeAlias.type === 'ArrayTypeAnnotation' || (typeAlias.id && typeAlias.id.name === 'Array');
}

export function isObjectMap(typeAlias: Object): boolean {
  return typeAlias.type === 'ObjectTypeAnnotation' && typeAlias.indexers.length > 0;
}

export function isImmutableType(typeAlias: Object): boolean {
  if (typeAlias.id && typeAlias.id.type === 'QualifiedTypeIdentifier' && typeAlias.id.qualification.name === 'Immutable') {
    return true;
  }
  return false;
}
