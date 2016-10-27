// @flow
import type { BarModelType } from './bar';
import { Bar } from './bar';
import ImmutableModel from '../../../src/ImmutableModel';

export type FooModelType = {
  ref: BarModelType,
  maybeRef: ?BarModelType,
  str: string,
};
