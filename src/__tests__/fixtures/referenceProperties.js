// @flow
import type { Bar } from './bar';
import ImmutableState from '../../../src/ImmutableState';

export type Foo = {
  ref: Bar,
  maybeRef: ?Bar,
  str: string,
};
