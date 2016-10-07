// @flow
const BUILT_IN_GENERIC_TYPES = ['Object', 'Function'];

export default function getReferenceProps(j: Object, props: Object) {
  return props.reduce((arr, prop) => {
    if (prop.value.type === 'GenericTypeAnnotation' && !BUILT_IN_GENERIC_TYPES.includes(prop.value.id.name)) {
      console.log(prop.key.name, prop.value.id.name);
      arr.push(prop);
    }
    return arr;
  }, []);
}
