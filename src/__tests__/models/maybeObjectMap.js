// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../../../src/ImmutableModel';

export type MaybeObjectMapModelType = {
  maap: ?{ [key: string]: number },
};

// /////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
// /////////////////////////////////////////////////////////////////////////////
export class MaybeObjectMap extends ImmutableModel {
  static fromJS(json: MaybeObjectMapModelType): MaybeObjectMap {
    const state: Object = Object.assign({}, json);
    state.maap = (state.maap ? Immutable.Map(state.maap) : state.maap);
    return new this(Immutable.Map(state));
  }

  toJS(): MaybeObjectMapModelType {
    const js = {
      maap: (this.maap ? this.maap.toObject() : this.maap),
    };

    return js;
  }

  get maap(): ?Immutable.Map<string, number> {
    return this._state.get('maap');
  }

  setMaap(maap: ?Immutable.Map<string, number>): this {
    return this.clone(this._state.set('maap', maap));
  }
}
