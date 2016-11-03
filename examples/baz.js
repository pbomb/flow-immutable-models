// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../src/ImmutableModel';

export type BazModelType = {
  bazNum: number,
  innerBazs: Array<InnerBazModelType>,
};

export type InnerBazModelType = {
  key: string,
  value: string,
}
