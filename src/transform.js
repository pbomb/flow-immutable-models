// @flow
import capitalize from './helpers/capitalize';
import fromJS from './helpers/fromJS';
import getReferenceProps from './helpers/getReferenceProps';
import getter from './helpers/getter';
import setter from './helpers/setter';
import { endsWithInterface, withoutInterfaceSuffix } from './helpers/withoutInterfaceSuffix';

const defaultPrintOptions = { quote: 'single', trailingComma: true };

export default function(file: Object, api: Object, options: Object) {
  const j = api.jscodeshift;

  const printOptions = options.printOptions || defaultPrintOptions;

  const root = j(file.source);
  const { program } = root.get().value;
  const { body } = program;

  const classes: Array<{|
    className: string,
    classDef: Array<Object>
  |}> = [];

  function makeClass(className, type, defaultValues) {
    const classNameIdentifier = j.identifier(className);
    const modelTypeAnnotation = j.typeAnnotation(
      j.genericTypeAnnotation(
        j.identifier(className),
        null
      )
    );
    const referenceProps = getReferenceProps(j, type.properties);
    const staticMethods = [
      fromJS(j, className, defaultValues, referenceProps, root),
      // fromImmutable(j, className),
    ];
    const instanceMethods = type.properties.reduce((methods, prop) => {
      methods.push(
        getter(j, prop),
        setter(j, prop, modelTypeAnnotation, className)
      );
      return methods;
    }, []);

    const classDeclaration = j.exportNamedDeclaration(
      j.classDeclaration(
        classNameIdentifier,
        j.classBody(staticMethods.concat(instanceMethods)),
        j.identifier('ImmutableModel')
      )
    );
    const comments = [
      '//////////////////////////////////////////////////////////////////////////////',
      '',
      ' NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.',
      '',
      ' If you need to update this class, update the corresponding flow type above ',
      ' and re-run the flow-immutable-models codemod',
      '',
      '//////////////////////////////////////////////////////////////////////////////',
    ];
    classDeclaration.comments = comments.map(comment => j.commentLine(comment));
    return [classDeclaration];
  }

  function parseType(td: Object) {
    const typeDef = Object.assign({}, td);
    delete typeDef.start;
    delete typeDef.end;
    delete typeDef.loc;
    delete typeDef.extra;

    if (typeDef.id) {
      typeDef.id = parseType(typeDef.id);
    }
    if (typeDef.key) {
      typeDef.key = parseType(typeDef.key);
    }
    if (typeDef.value) {
      typeDef.value = parseType(typeDef.value);
    }

    if (typeDef.types) {
      typeDef.types = typeDef.types.map(parseType);
    }
    if (typeDef.properties) {
      typeDef.properties = typeDef.properties.map(parseType);
    }

    return typeDef;
  }

  root
    .find(j.ExportNamedDeclaration)
    .filter((p) => {
      if (p.node.exportKind === 'type') {
        const identifier = p.node.declaration.id.name;
        return endsWithInterface(identifier);
      }
      return false;
    })
    .forEach(
      (p) => {
        const identifier = p.node.declaration.id.name;
        const className = withoutInterfaceSuffix(identifier);
        const parsed = parseType(p.node.declaration.right);
        const defaultValuesName = `default${capitalize(className)}Values`;
        const defaultValues = root
          .find(j.VariableDeclaration)
          .filter(path =>
            path.node.declarations.some(dec => dec.id.name === defaultValuesName)
          );

        classes.push({
          className,
          classDef: makeClass(
            className,
            parsed,
            defaultValues.size() === 1 ? defaultValuesName : null
          ),
        });
      }
    );

  classes.forEach(({ className, classDef }) => {
    const alreadyExportedClass = root
      .find(j.ExportNamedDeclaration)
      .filter(path => path.node.declaration.type === 'ClassDeclaration' && path.node.declaration.id.name === className);

    if (alreadyExportedClass.size() === 1) {
      alreadyExportedClass.replaceWith(classDef);
    } else {
      body.push(...classDef);
    }
  });

  return root.toSource(printOptions);
}
