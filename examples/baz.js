// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../src/ImmutableModel';

export type BazModelType = {
  num: number,
  innerBazAry: Array<InnerBazModelType>,
};

export type InnerBazModelType = {
  key: string,
  value: string,
}

////////////////////////////////////////////////////////////////////////////////
//
// NOTE: EVERYTHING BELOW THIS COMMENT IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
////////////////////////////////////////////////////////////////////////////////
export class Baz extends ImmutableModel {
  static fromJS(json: BazModelType): Baz {
    const state = Object.assign({}, json);
    state.innerBazAry = state.innerBazAry.map(item => InnerBaz.fromJS(item));
    return new Baz(Immutable.fromJS(state));
  }

  get num(): number {
    return this._state.get('num');
  }

  setNum(num: number): Baz {
    return new Baz(this._state.set('num', num));
  }

  get innerBazAry(): Immutable.List<InnerBaz> {
    return this._state.get('innerBazAry');
  }

  setInnerBazAry(innerBazAry: Immutable.List<InnerBaz>): Baz {
    return new Baz(this._state.set('innerBazAry', innerBazAry));
  }
}

export class InnerBaz extends ImmutableModel {
  static fromJS(json: InnerBazModelType): InnerBaz {
    const state = Object.assign({}, json);
    return new InnerBaz(Immutable.fromJS(state));
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
