import path from 'path';
import transformFixture from '../test-utils/transformFixture';

async function transform(filename: string): Promise<string> {
  return transformFixture(path.join(__dirname, 'fixtures', filename));
}

async function snap(filename: string): string {
  const output = await transform(filename);
  expect(output).toMatchSnapshot();
}

describe('transform', () => {
  it('adds default class for exported typed object', async () => {
    await snap('exportedType.js');
  });

  it('converts referenced types in getters and setters', async () => {
    await snap('referenceProperties.js');
  });

  it('converts arrays to Immutable lists', async () => {
    await snap('arrayType.js');
  });

  it('does not instantiate inline non-class props', async () => {
    await snap('nonClassInlineTypes.js');
  });

  it('does not instantiate imported types', async () => {
    await snap('nonClassImportedTypes.js');
  });

  it('initializes arrays of other model types', async () => {
    await snap('arrayOfModelType.js');
  });

  it('converts object maps to immutable maps', async () => {
    await snap('mapLikeProperties.js');
  });

  it('converts maybe props to use nullable fields', async () => {
    await snap('maybeProps.js');
  });

  it('converts string literal types', async () => {
    await snap('stringLiteral.js');
  });

  it('provides meaningful error message when ModelType is a UnionTypeAnnotation', async () => {
    try {
      await transform('unionModelType.js');
    } catch (e) {
      return expect(e.message).toBe(
        `Expected CellModelType to be of type ObjectTypeAnnotation. Instead it was of type UnionTypeAnnotation.

All types ending with "ModelType" are expected to be defined as object literals with properties.
Perhaps you didn't mean for CellModelType to be a ModelType.
`,
      );
    }
    throw new Error('Expected error to be thrown');
  });
});
