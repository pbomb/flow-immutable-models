// @flow
import ImmutableState from './ImmutableState';

export type Bar = {
  str: string,
  num: number,
  obj: Object,
};

export type Foo = {
  str: ?string,
  num: ?number,
  obj: ?Object,
};


  // static fromJS(state: FilterStateType): this {
  //   return this.fromImmutable(Immutable.fromJS(state));
  // }
  //
  // static fromImmutable(immutableState: Immutable.Map<string, any>): this {
  //   return new FilterState(immutableState);
  // }
  //
  // initialize(): Immutable.Map<string, any> {
  //   let state = Immutable.Map();
  //   return state;
  // }
