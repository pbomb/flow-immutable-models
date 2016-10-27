// @flow
import ImmutableModel from '../../../src/ImmutableModel';

type Operator = "*" | "/" | "+" | "-";
export type Comparator = "<" | ">" | "=" | "!=";

export type NonClassModelType = {
  operator: Operator,
  comparator: Comparator,
};
