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

  it('initilizes Immutable lists and maps', async () => {
    await snap('immutableProperties.js');
  });

  it('initilizes referenced types', async () => {
    await snap('referenceProperties.js');
  });

  it('initilizes arrays without new operator', async () => {
    await snap('arrayType.js');
  });

  it('does not instantiate inline non-class props', async () => {
    await snap('nonClassInlineTypes.js');
  });

  it('does not instantiate imported types', async () => {
    await snap('nonClassImportedTypes.js');
  });
});
