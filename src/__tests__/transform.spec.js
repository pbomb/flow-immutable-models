import path from 'path';
import transformFixture from '../test-utils/transformFixture';

async function snap(filename: string): string {
  const output = await transformFixture(path.join(__dirname, 'fixtures', filename));
  expect(output).toMatchSnapshot();
}

describe('transform', () => {
  it('adds default class for exported typed object', async () => {
    await snap('exportedType.js');
  });

  it('handles Immutable lists and maps', async () => {
    await snap('immutableProperties.js');
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

  it('provides default values', async () => {
    await snap('defaults.js');
  });
});
