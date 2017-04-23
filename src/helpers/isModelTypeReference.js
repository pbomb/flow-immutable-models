// @flow
import { endsWithModelType } from './withoutModelTypeSuffix';
import { isArray, isObjectMap } from './flowTypes';

function isArrayOfModelType(typeAlias: Object): boolean {
  return (
    isArray(typeAlias) &&
    Boolean(typeAlias.typeParameters) &&
    typeAlias.typeParameters.params[0].type === 'GenericTypeAnnotation' &&
    endsWithModelType(typeAlias.typeParameters.params[0].id.name)
  );
}

function isObjectMapOfModelType(typeAlias: Object): boolean {
  if (isObjectMap(typeAlias)) {
    const propIndexer = typeAlias.indexers[0];
    return endsWithModelType(propIndexer && propIndexer.value.id && propIndexer.value.id.name);
  }
  return false;
}

export default function isModelTypeReference(typeAlias: Object): boolean {
  const alias = typeAlias.type === 'NullableTypeAnnotation' ? typeAlias.typeAnnotation : typeAlias;
  return (
    endsWithModelType(alias.id && alias.id.name) ||
    isArrayOfModelType(alias) ||
    isObjectMapOfModelType(alias)
  );
}
