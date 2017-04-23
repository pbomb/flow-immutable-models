// @flow

const modelTypeLength = 'ModelType'.length;

export function endsWithModelType(str: ?string): boolean {
  return (
    !!str &&
    str.length > modelTypeLength &&
    str.indexOf('ModelType') === str.length - modelTypeLength
  );
}

export function withoutModelTypeSuffix(str: string): string {
  if (endsWithModelType(str)) {
    return str.substring(0, str.length - 'ModelType'.length);
  }
  return str;
}
