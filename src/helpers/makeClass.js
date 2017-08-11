import fromJS from './fromJS';
import getter from './getter';
import setter from './setter';
import toJS from './toJS';

export default function makeClass(t, className, type, defaultValues) {
  const classNameIdentifier = t.identifier(className);
  const staticMethods = [fromJS(t, className, defaultValues, type.properties)];
  const instanceMethods = type.properties.reduce(
    (methods, prop) => {
      methods.push(getter(t, prop), setter(t, prop));
      return methods;
    },
    [toJS(t, className, type.properties)]
  );

  const comments = [
    ' /////////////////////////////////////////////////////////////////////////////',
    '',
    ' NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.',
    '',
    ' If you need to update this class, update the corresponding flow type above',
    ' and re-run the flow-immutable-models codemod',
    '',
    ' /////////////////////////////////////////////////////////////////////////////',
  ];
  const classExportDeclaration = t.exportNamedDeclaration(
    t.classDeclaration(
      classNameIdentifier,
      t.identifier('ImmutableModel'),
      t.classBody(staticMethods.concat(instanceMethods)),
      []
    ),
    []
  );
  classExportDeclaration.comments = comments.map(comment => ({
    type: 'CommentLine',
    value: comment,
  }));
  return classExportDeclaration;
}
