// @flow

export default function isImmutableType(typeAlias: Object): boolean {
  if (typeAlias.id && typeAlias.id.type === 'QualifiedTypeIdentifier' && typeAlias.id.qualification.name === 'Immutable') {
    return true;
  }
  return false;
}
