// @flow
import ImmutableModel from 'flow-immutable-models';

import * as Immutable from 'immutable';
export type QuuxModelType = {
  id: number,
  name: string,
};

// /////////////////////////////////////////////////////////////////////////////
//
// NOTE: EVERYTHING BELOW THIS COMMENT IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
// /////////////////////////////////////////////////////////////////////////////
export class Quux extends ImmutableModel {
  static fromJS(json: QuuxModelType): Quux {
    const state: Object = Object.assign({}, json);
    return new this(Immutable.Map(state));
  }

  toJS(): QuuxModelType {
    return {
      id: this.id,
      name: this.name,
    };
  }

  get id(): number {
    return this._state.get('id');
  }

  setId(id: number): this {
    return this.clone(this._state.set('id', id));
  }

  get name(): string {
    return this._state.get('name');
  }

  setName(name: string): this {
    return this.clone(this._state.set('name', name));
  }
}
