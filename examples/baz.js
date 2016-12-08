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

////////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
////////////////////////////////////////////////////////////////////////////////
export class Baz extends ImmutableModel {
  static fromJS(json: BazModelType): Baz {
    const state: Object = Object.assign({}, json);
    state.innerBazs = state.innerBazs.map(item => InnerBaz.fromJS(item));
    return new this(Immutable.fromJS(state));
  }

  get bazNum(): number {
    return this._state.get('bazNum');
  }

  setBazNum(bazNum: number): Baz {
    return new Baz(this._state.set('bazNum', bazNum));
  }

  get innerBazs(): Immutable.List<InnerBaz> {
    return this._state.get('innerBazs');
  }

  setInnerBazs(innerBazs: Immutable.List<InnerBaz>): Baz {
    return new Baz(this._state.set('innerBazs', innerBazs));
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
////////////////////////////////////////////////////////////////////////////////
export class InnerBaz extends ImmutableModel {
  static fromJS(json: InnerBazModelType): InnerBaz {
    const state: Object = Object.assign({}, json);
    return new this(Immutable.fromJS(state));
  }

  get key(): string {
    return this._state.get('key');
  }

  setKey(key: string): InnerBaz {
    return new InnerBaz(this._state.set('key', key));
  }

  get value(): string {
    return this._state.get('value');
  }

  setValue(value: string): InnerBaz {
    return new InnerBaz(this._state.set('value', value));
  }
}
