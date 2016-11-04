// @flow
import capitalize from './helpers/capitalize';
import fromJS from './helpers/fromJS';
import getter from './helpers/getter';
import setter from './helpers/setter';
import toJS from './helpers/toJS';
import { endsWithModelType, withoutModelTypeSuffix } from './helpers/withoutModelTypeSuffix';

const comments = [
  ' /////////////////////////////////////////////////////////////////////////////',
  '',
  ' NOTE: EVERYTHING BELOW THIS COMMENT IS GENERATED. DO NOT MAKE CHANGES HERE.',
  '',
  ' If you need to update this class, update the corresponding flow type above',
  ' and re-run the flow-immutable-models codemod',
  '',
  ' /////////////////////////////////////////////////////////////////////////////',
];
const defaultPrintOptions = { quote: 'single', trailingComma: true };

export default function(file: Object, api: Object, options: Object) {
  const j = api.jscodeshift;

  const printOptions = options.printOptions || defaultPrintOptions;

  const root = j(file.source);
  const { program } = root.get().value;
  let { body } = program;
  let hasAppliedCutlineComment = false;

  function nodeHasCutlineComment(node): boolean {
    return node &&
      node.comments &&
      node.comments.length === comments.length &&
      node.comments.every((c, i) => comments[i] === c.value);
  }

  function prependCutlineCommentBlockOnce(): ?Array<Object> {
    if (!hasAppliedCutlineComment) {
      hasAppliedCutlineComment = true;
      return comments.map(comment => j.commentLine(comment));
    }
    return undefined;
  }

  function makeClass(className, type, defaultValues) {
    const classNameIdentifier = j.identifier(className);
    const staticMethods = [
      fromJS(j, className, defaultValues, type.properties),
    ];
    const instanceMethods = type.properties.reduce((methods, prop) => {
      methods.push(
        getter(j, prop),
        setter(j, prop)
      );
      return methods;
    }, [
      toJS(j, className, type.properties),
    ]);

    const classDeclaration = j.exportNamedDeclaration(
      j.classDeclaration(
        classNameIdentifier,
        j.classBody(staticMethods.concat(instanceMethods)),
        j.identifier('ImmutableModel')
      )
    );
    classDeclaration.comments = prependCutlineCommentBlockOnce();
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

  let keep = true;
  body = body
    .filter((n) => {
      keep = keep && !nodeHasCutlineComment(n);
      return keep;
    });

  let insertImmutableImport = true;
  let insertImmutableModelImport = true;
  body
    .forEach((p) => {
      if (p.type !== 'ImportDeclaration') {
        return;
      }
      p.specifiers.forEach((s) => {
        if (s.local.name === 'Immutable') {
          insertImmutableImport = false;
        } else if (s.local.name === 'ImmutableModel') {
          insertImmutableModelImport = false;
        }
      });
    });

  if (insertImmutableImport) {
    const nameIdentifier = j.identifier('Immutable');
    const variable = j.importNamespaceSpecifier(nameIdentifier);
    const declaration = j.importDeclaration([variable], j.literal('immutable'));

    if (body[0].comments) {
      declaration.comments = body[0].comments;
      delete body[0].comments;
    }

    body = [declaration].concat(body);
  }

  if (insertImmutableModelImport) {
    const nameIdentifier = j.identifier('ImmutableModel');
    const variable = j.importDefaultSpecifier(nameIdentifier);
    const declaration = j.importDeclaration([variable], j.literal('flow-immutable-models'));

    if (body[0].comments) {
      declaration.comments = body[0].comments;
      delete body[0].comments;
    }

    body = [declaration].concat(body);
  }

  root
    .find(j.ExportNamedDeclaration)
    .filter((p) => {
      if (p.node.exportKind === 'type') {
        const identifier = p.node.declaration.id.name;
        return endsWithModelType(identifier);
      }
      return false;
    })
    .forEach((p) => {
      const identifier = p.node.declaration.id.name;
      const className = withoutModelTypeSuffix(identifier);
      const parsed = parseType(p.node.declaration.right);
      if (parsed.type !== 'ObjectTypeAnnotation') {
        throw new Error(`Expected ${identifier} to be of type ObjectTypeAnnotation. Instead it was of type ${parsed.type}.

All types ending with "ModelType" are expected to be defined as object literals with properties.
Perhaps you didn't mean for ${identifier} to be a ModelType.
`);
      }
      const defaultValuesName = `default${capitalize(className)}Values`;
      const defaultValues = root
        .find(j.VariableDeclaration)
        .filter(path =>
          path.node.declarations.some(dec => dec.id.name === defaultValuesName)
        );

      body.push(makeClass(
        className,
        parsed,
        defaultValues.size() === 1 ? defaultValuesName : null
      ));
    });

  root.get().value.program.body = body;
  return root.toSource(printOptions);
}
