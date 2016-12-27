// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../../../src/ImmutableModel';

export type OtherModelType = {
  prop: boolean,
};

export type MyMapModelType = {
  numberMap: { [key: string]: number },
  modelMap: { [key: string]: OtherModelType },
};
