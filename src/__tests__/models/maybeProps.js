// @flow
/* eslint-disable */
import * as Immutable from 'immutable';
import ImmutableModel from '../../../src/ImmutableModel';

export type MaybePropsModelType = {
  maybePropNum?: number,
  maybePropStr?: ?string,
  maybePropArr?: Array<string>,
};

// /////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
// /////////////////////////////////////////////////////////////////////////////
export class MaybeProps extends ImmutableModel {
  static fromJS(json: MaybePropsModelType): MaybeProps {
    const state: Object = Object.assign({}, json);
    state.maybePropArr = (state.maybePropArr ? Immutable.List(state.maybePropArr) : state.maybePropArr);
    return new this(Immutable.Map(state));
  }

  toJS(): MaybePropsModelType {
    const js = {};

    if (this.maybePropNum != null)
      js.maybePropNum = this.maybePropNum;

    if (this.maybePropStr != null)
      js.maybePropStr = this.maybePropStr;

    if (this.maybePropArr != null)
      js.maybePropArr = (this.maybePropArr ? this.maybePropArr.toArray() : this.maybePropArr);

    return js;
  }

  get maybePropNum(): ?number {
    return this._state.get('maybePropNum');
  }

  setMaybePropNum(maybePropNum: ?number): this {
    return this.clone(this._state.set('maybePropNum', maybePropNum));
  }

  get maybePropStr(): ?string {
    return this._state.get('maybePropStr');
  }

  setMaybePropStr(maybePropStr: ?string): this {
    return this.clone(this._state.set('maybePropStr', maybePropStr));
  }

  get maybePropArr(): ?Immutable.List<string> {
    return this._state.get('maybePropArr');
  }

  setMaybePropArr(maybePropArr: ?Immutable.List<string>): this {
    return this.clone(this._state.set('maybePropArr', maybePropArr));
  }
}
