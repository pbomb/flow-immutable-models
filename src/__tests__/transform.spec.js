import path from 'path';
import transformFixture from '../test-utils/transformFixture';

function getFixture(filename: string): string {
  return path.join(__dirname, 'fixtures', filename);
}

describe('transform', () => {
  it('adds default class for exported typed object', async () => {
    const output = await transformFixture(getFixture('exportedType.js'));
    expect(output).toMatchSnapshot();
  });
});
