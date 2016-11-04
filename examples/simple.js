// @flow
import * as Immutable from 'immutable';

export type SimpleModelType = {
  simpleNumber: number,
};
import ImmutableModel from 'ImmutableModel';

////////////////////////////////////////////////////////////////////////////////
//
// NOTE: EVERYTHING BELOW THIS COMMENT IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
////////////////////////////////////////////////////////////////////////////////
export class Simple extends ImmutableModel {
  static fromJS(json: SimpleModelType): Simple {
    const state = Object.assign({}, json);
    return new Simple(Immutable.fromJS(state));
  }

  get simpleNumber(): number {
    return this._state.get('simpleNumber');
  }

  setSimpleNumber(simpleNumber: number): Simple {
    return new Simple(this._state.set('simpleNumber', simpleNumber));
  }
}
