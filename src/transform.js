// @flow
import makeClass from './helpers/makeClass';
import parseType from './helpers/parseType';
import {
  getFromJSTypeStatement,
  getFullTypeStatement,
  getOptionalTypeStatement,
  getRequiredTypeStatement,
} from './helpers/getDefaultValueTypeStatements';
import { endsWithModelType, withoutModelTypeSuffix } from './helpers/withoutModelTypeSuffix';

// const defaultPrintOptions = { quote: 'single', trailingComma: true };

const getDefaultValuesClassName = (name: string) => {
  const valuesIndex = name.indexOf('Values');
  const defaultIndex = name.indexOf('default');
  if (
    name.length > 'defaultValues'.length &&
    defaultIndex === 0 &&
    valuesIndex === name.length - 'Values'.length
  ) {
    return name.substring('default'.length, valuesIndex);
  }
  return null;
};

export default function(babel: any) {
  const { types: t } = babel;

  let classes: Array<{|
    className: string,
    parsedType: Object,
    path: any,
  |}> = [];
  let classDefaultValues = {};
  let existingClasses = {};
  let existingTypeAliases = {};

  const replaceOrAddStatement = (programPath: any, existingPath: any, statement: Object | null) => {
    if (existingPath) {
      if (statement) {
        existingPath.replaceWith(statement);
      } else {
        existingPath.remove();
      }
    } else if (statement) {
      programPath.pushContainer('body', statement);
    }
  };

  return {
    name: 'flow-immutable-models',
    visitor: {
      Program(p: any) {
        classes = [];
        classDefaultValues = {};
        existingClasses = {};
        existingTypeAliases = {};

        p.traverse({
          ExportNamedDeclaration(path: any) {
            let isExportedModelType = false;
            const declaration = path.node.declaration;
            if (path.node.exportKind === 'type') {
              const identifier = declaration.id.name;
              isExportedModelType = endsWithModelType(identifier);
            }

            if (isExportedModelType) {
              const identifier = declaration.id.name;
              const className = withoutModelTypeSuffix(identifier);
              const parsedType: Object = parseType(declaration.right);
              if (parsedType.type !== 'ObjectTypeAnnotation') {
                throw new Error(
                  `Expected ${identifier} to be of type ObjectTypeAnnotation. Instead it was of type ${parsedType.type}.

        All types ending with "ModelType" are expected to be defined as object literals with properties.
        Perhaps you didn't mean for ${identifier} to be a ModelType.
        `
                );
              }
              classes.push({
                className,
                parsedType,
                path,
              });
            } else if (declaration.type === 'ClassDeclaration') {
              const className = declaration.id.name;
              existingClasses[className] = path;
            }
          },
          VariableDeclaration(path: any) {
            path.node.declarations.forEach(dec => {
              const name = dec.id.name;
              const className = getDefaultValuesClassName(name);
              if (className) {
                classDefaultValues[className] = dec;
              }
            });
          },
          TypeAlias(path: any) {
            const typeName = path.node.id.name;
            existingTypeAliases[typeName] = path;
          },
        });

        classes.forEach(({ className, parsedType }) => {
          const defaultValues = classDefaultValues[className];
          const classDef = makeClass(t, className, parsedType, defaultValues);
          const optionalType = getOptionalTypeStatement(t, className, defaultValues);
          const requiredType = getRequiredTypeStatement(
            t,
            className,
            defaultValues,
            parsedType.properties
          );
          const fromJSType = getFromJSTypeStatement(t, className, defaultValues);
          const fullType = getFullTypeStatement(t, className, defaultValues);

          replaceOrAddStatement(p, existingClasses[className], classDef);
          replaceOrAddStatement(
            p,
            existingTypeAliases[`${className}OptionalArguments`],
            optionalType
          );
          replaceOrAddStatement(
            p,
            existingTypeAliases[`${className}RequiredArguments`],
            requiredType
          );
          replaceOrAddStatement(p, existingTypeAliases[`${className}FullType`], fullType);
          replaceOrAddStatement(p, existingTypeAliases[`${className}FromJSType`], fromJSType);
        });
      },
    },
  };
}
