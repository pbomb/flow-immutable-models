// @flow
import { endsWithModelType } from './withoutModelTypeSuffix';

function isArrayOfModelType(typeAlias: Object) {
  return typeAlias.id &&
    typeAlias.id.name === 'Array' &&
    typeAlias.typeParameters &&
    typeAlias.typeParameters.params[0].type === 'GenericTypeAnnotation' &&
    endsWithModelType(typeAlias.typeParameters.params[0].id.name);
}

function isImmutableListOfModelType(typeAlias: Object) {
  return typeAlias.id &&
    typeAlias.id.type === 'QualifiedTypeIdentifier' &&
    typeAlias.id.qualification.name === 'Immutable' &&
    typeAlias.id.id.name === 'List' &&
    typeAlias.typeParameters &&
    typeAlias.typeParameters.params[0].type === 'GenericTypeAnnotation' &&
    endsWithModelType(typeAlias.typeParameters.params[0].id.name);
}

export default function isModelTypeReference(typeAlias: Object): boolean {
  const alias = typeAlias.type === 'NullableTypeAnnotation' ? typeAlias.typeAnnotation : typeAlias;
  return endsWithModelType(alias.id && alias.id.name) ||
    isArrayOfModelType(alias) ||
    isImmutableListOfModelType(alias);
}
