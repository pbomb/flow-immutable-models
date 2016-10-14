// @flow
import initialize from './helpers/initialize';
import fromJS from './helpers/fromJS';
import fromImmutable from './helpers/fromImmutable';
import getReferenceProps from './helpers/getReferenceProps';
import getter from './helpers/getter';
import setter from './helpers/setter';

const defaultPrintOptions = { quote: 'single', trailingComma: true };
export default function(file: Object, api: Object, options: Object) {
  const j = api.jscodeshift;

  const printOptions = options.printOptions || defaultPrintOptions;

  function makeClass(className, type) {
    const classNameIdentifier = j.identifier(className);
    const modelTypeAnnotation = j.typeAnnotation(
      j.genericTypeAnnotation(
        j.identifier(className),
        null
      )
    );
    const objectTypeAnnotation = j.typeAnnotation(
      j.genericTypeAnnotation(
        j.identifier(`${className}Interface`),
        null
      )
    );
    const staticMethods = [
      fromJS(j, objectTypeAnnotation, className),
      fromImmutable(j, className),
    ];
    const instanceMethods = type.properties.reduce((methods, prop) => {
      methods.push(
        getter(j, prop),
        setter(j, prop, modelTypeAnnotation, className)
      );
      return methods;
    }, [
      initialize(j, getReferenceProps(j, type.properties)),
    ]);
    return j.exportNamedDeclaration(
      j.classDeclaration(
        classNameIdentifier,
        j.classBody(staticMethods.concat(instanceMethods)),
        j.identifier('ImmutableModel')
      )
    );
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

  const root = j(file.source);
  const { program } = root.get().value;
  const { body } = program;

  const classes: Array<{|
    className: string,
    classDef: Object
  |}> = [];

  root
    .find(j.ExportNamedDeclaration)
    .filter((p) => {
      if (p.node.exportKind === 'type') {
        const identifier = p.node.declaration.id.name;
        return identifier.indexOf('Interface') === identifier.length - 'Interface'.length;
      }
      return false;
    })
    .forEach(
      (p) => {
        const identifier = p.node.declaration.id.name;
        const className = identifier.substring(0, identifier.length - 'Interface'.length);
        const parsed = parseType(p.node.declaration.right);
        classes.push({
          className,
          classDef: makeClass(className, parsed),
        });
      }
    );

  classes.forEach(({ className, classDef }) => {
    const alreadyExportedClass = root
      .find(j.ExportNamedDeclaration)
      .filter(path => path.node.declaration.id.name === className);

    if (alreadyExportedClass.size() === 1) {
      alreadyExportedClass.replaceWith(classDef);
    } else {
      body.push(classDef);
    }
  });

  return root.toSource(printOptions);
}
