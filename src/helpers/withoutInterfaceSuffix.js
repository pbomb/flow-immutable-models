// @flow

const intfLength = 'Interface'.length;

export function endsWithInterface(str: string): boolean {
  return str.length > intfLength && str.indexOf('Interface') === str.length - intfLength;
}

export function withoutInterfaceSuffix(str: string): string {
  if (endsWithInterface(str)) {
    return str.substring(0, str.length - 'Interface'.length);
  }
  return str;
}
