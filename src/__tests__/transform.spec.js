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
});
