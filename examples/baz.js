// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../src/ImmutableModel';

export type BazModelType = {
  num: number,
  innerBazAry: Array<InnerBazModelType>,
};

export type InnerBazModelType = {
  key: string,
  value: string,
}
