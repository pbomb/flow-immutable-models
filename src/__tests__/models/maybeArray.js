// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../../../src/ImmutableModel';

export type MaybeArrayModelType = {
  ary: ?Array<string>,
};

// /////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
// /////////////////////////////////////////////////////////////////////////////
export class MaybeArray extends ImmutableModel {
  static fromJS(json: MaybeArrayModelType): MaybeArray {
    const state: Object = Object.assign({}, json);
    state.ary = (state.ary ? Immutable.List(state.ary) : state.ary);
    return new this(Immutable.Map(state));
  }

  toJS(): MaybeArrayModelType {
    return {
      ary: (this.ary ? this.ary.toArray() : this.ary),
    };
  }

  get ary(): ?Immutable.List<string> {
    return this._state.get('ary');
  }

  setAry(ary: ?Immutable.List<string>): this {
    return this.clone(this._state.set('ary', ary));
  }
}
