// @flow

export function getRequiredTypeStatement(
  j: Object,
  className: string,
  defaultValues: Object | null,
  typeProperties: Array<Object>
) {
  if (!defaultValues) {
    return null;
  }
  const defaultPropNames = defaultValues.init.properties.map(p => p.key.name);
  const requiredProperties = typeProperties.filter(p => !defaultPropNames.includes(p.key.name));
  return j.typeAlias(
    j.identifier(`${className}RequiredArguments`),
    null,
    j.objectTypeAnnotation(requiredProperties)
  );
}

export function getFullTypeStatement(j: Object, className: string, defaultValues: Object | null) {
  if (!defaultValues) {
    return null;
  }
  return j.typeAlias(
    j.identifier(`${className}FullType`),
    null,
    j.intersectionTypeAnnotation([
      j.genericTypeAnnotation(j.identifier(`${className}OptionalArguments`), null),
      j.genericTypeAnnotation(j.identifier(`${className}RequiredArguments`), null),
    ])
  );
}

export function getFromJSTypeStatement(j: Object, className: string, defaultValues: Object | null) {
  if (!defaultValues) {
    return null;
  }
  return j.typeAlias(
    j.identifier(`${className}FromJSType`),
    null,
    j.intersectionTypeAnnotation([
      j.genericTypeAnnotation(
        j.identifier('$Shape'),
        j.typeParameterInstantiation([
          j.genericTypeAnnotation(j.identifier(`${className}FullType`), null),
        ])
      ),
      j.genericTypeAnnotation(j.identifier(`${className}RequiredArguments`), null),
    ])
  );
}

export function getOptionalTypeStatement(
  j: Object,
  className: string,
  defaultValues: Object | null
) {
  if (!defaultValues) {
    return null;
  }
  return j.typeAlias(
    j.identifier(`${className}OptionalArguments`),
    null,
    j.typeofTypeAnnotation(j.genericTypeAnnotation(j.identifier(defaultValues.id.name), null))
  );
}
