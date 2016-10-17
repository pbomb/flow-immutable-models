// @flow
import { endsWithInterface } from './withoutInterfaceSuffix';

function getNonClassImportedTypes(j: Object, root: Object): Array<string> {
  const names: Array<string> = [];
  root
    .find(j.TypeAlias)
    .filter(path => !endsWithInterface(path.node.id.name))
    .forEach(path => names.push(path.node.id.name));

  return names;
}

function getNonClassInlineTypes(j: Object, root: Object): Array<string> {
  const names: Array<string> = [];
  root
    .find(j.TypeAlias)
    .filter(path => !endsWithInterface(path.node.id.name))
    .forEach(path => names.push(path.node.id.name));

  return names;
}

export default function getNonClassTypes(j: Object, root: Object) {
  return getNonClassInlineTypes(j, root).concat(getNonClassImportedTypes(j, root));
}
