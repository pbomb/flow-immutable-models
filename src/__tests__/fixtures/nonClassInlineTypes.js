// @flow
import ImmutableModel from '../../../src/ImmutableModel';

type Operator = "*" | "/" | "+" | "-";
export type Comparator = "<" | ">" | "=" | "!=";

export type NonClassInterface = {
  operator: Operator,
  comparator: Comparator,
};
