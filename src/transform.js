// @flow
import capitalize from './helpers/capitalize';
import fromJS from './helpers/fromJS';
import {
  getFromJSTypeStatement,
  getFullTypeStatement,
  getOptionalTypeStatement,
  getRequiredTypeStatement,
} from './helpers/getDefaultValueTypeStatements';
import getter from './helpers/getter';
import setter from './helpers/setter';
import toJS from './helpers/toJS';
import { endsWithModelType, withoutModelTypeSuffix } from './helpers/withoutModelTypeSuffix';

const defaultPrintOptions = { quote: 'single', trailingComma: true };

export default function(file: Object, api: Object, options: Object) {
  const j: any = api.jscodeshift;

  const printOptions = options.printOptions || defaultPrintOptions;

  const root = j(file.source);
  const { program } = root.get().value;
  const { body } = program;

  const classes: Array<{|
    className: string,
    classDef: Object,
    fromJSType: Object | null,
    fullType: Object | null,
    optionalType: Object | null,
    requiredType: Object | null,
  |}> = [];

  function makeClass(className, type, defaultValues) {
    const classNameIdentifier = j.identifier(className);
    const staticMethods = [fromJS(j, className, defaultValues, type.properties)];
    const instanceMethods = type.properties.reduce(
      (methods, prop) => {
        methods.push(getter(j, prop), setter(j, prop));
        return methods;
      },
      [toJS(j, className, type.properties)],
    );

    const classDeclaration = j.exportNamedDeclaration(
      j.classDeclaration(
        classNameIdentifier,
        j.classBody(staticMethods.concat(instanceMethods)),
        j.identifier('ImmutableModel'),
      ),
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
    classDeclaration.comments = comments.map(comment => j.commentLine(comment));
    return classDeclaration;
  }

  function parseType<T: Object | string>(td: T): T {
    if (typeof td === 'string') {
      return td;
    }
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
    .filter(p => {
      if (p.node.exportKind === 'type') {
        const identifier = p.node.declaration.id.name;
        return endsWithModelType(identifier);
      }
      return false;
    })
    .forEach(p => {
      const identifier = p.node.declaration.id.name;
      const className = withoutModelTypeSuffix(identifier);
      const parsedType: Object = parseType(p.node.declaration.right);
      if (parsedType.type !== 'ObjectTypeAnnotation') {
        throw new Error(
          `Expected ${identifier} to be of type ObjectTypeAnnotation. Instead it was of type ${parsedType.type}.

All types ending with "ModelType" are expected to be defined as object literals with properties.
Perhaps you didn't mean for ${identifier} to be a ModelType.
`,
        );
      }
      const defaultValuesName = `default${capitalize(className)}Values`;
      let defaultValues: Object | null = null;
      root.find(j.VariableDeclaration).filter(path =>
        path.node.declarations.forEach(dec => {
          if (dec.id.name === defaultValuesName) {
            defaultValues = dec;
          }
        }),
      );

      classes.push({
        className,
        classDef: makeClass(className, parsedType, defaultValues),
        optionalType: getOptionalTypeStatement(j, className, defaultValues),
        requiredType: getRequiredTypeStatement(j, className, defaultValues, parsedType.properties),
        fromJSType: getFromJSTypeStatement(j, className, defaultValues),
        fullType: getFullTypeStatement(j, className, defaultValues),
      });
    });

  const replaceOrAddStatement = (
    tokenType: Object,
    filterFn: (path: Object) => boolean,
    statement: Object | null,
  ) => {
    const existingStatement = root.find(tokenType).filter(filterFn);

    if (existingStatement.size() === 1) {
      existingStatement.replaceWith(statement);
    } else {
      body.push(statement);
    }
  };

  classes.forEach(({ className, classDef, fromJSType, fullType, optionalType, requiredType }) => {
    replaceOrAddStatement(
      j.ExportNamedDeclaration,
      path =>
        path.node.declaration.type === 'ClassDeclaration' &&
        path.node.declaration.id.name === className,
      classDef,
    );
    replaceOrAddStatement(
      j.TypeAlias,
      path => path.node.id.name === `${className}OptionalArguments`,
      optionalType,
    );
    replaceOrAddStatement(
      j.TypeAlias,
      path => path.node.id.name === `${className}RequiredArguments`,
      requiredType,
    );
    replaceOrAddStatement(
      j.TypeAlias,
      path => path.node.id.name === `${className}FullType`,
      fullType,
    );
    replaceOrAddStatement(
      j.TypeAlias,
      path => path.node.id.name === `${className}FromJSType`,
      fromJSType,
    );
  });

  return root.toSource(printOptions);
}
