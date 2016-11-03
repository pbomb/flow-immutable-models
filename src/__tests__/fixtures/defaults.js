// @flow
import * as Immutable from 'immutable';
import type { BarModelType } from './bar';
import { defaultBarValues } from './bar';

export type DefaultsModelType = {
  str: string,
  num: number,
  bool: boolean,
  bar: BarModelType,
  barAry: Array<BarModelType>,
  regArray: Array<boolean>,
  lst: Immutable.List<BarModelType>,
  maap: Immutable.Map<string, any>,
};

const defaultDefaultsValues: $Shape<DefaultsModelType> = {
  str: 'strInitial',
  num: 42,
  bool: true,
  bar: defaultBarValues,
  barAry: undefined,
  regArray: [false, true, false],
  lst: Immutable.List(),
  maap: Immutable.Map(),
};
