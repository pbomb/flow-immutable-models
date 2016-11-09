// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../src/ImmutableModel';

export type BarModelType = {
  barStr: string,
  barNum: number,
};

export const defaultBarValues: BarModelType = {
  barStr: 'foo',
  barNum: 3,
}

////////////////////////////////////////////////////////////////////////////////
//
// NOTE: EVERYTHING BELOW THIS COMMENT IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
////////////////////////////////////////////////////////////////////////////////
export class Bar extends ImmutableModel {
  static fromJS(json: $Diff<BarModelType, typeof defaultBarValues>): Bar {
    // $FlowFixMe
    const state = Object.assign({}, defaultBarValues, json);

    return new Bar(Immutable.fromJS(state));
  }

  get barStr(): string {
    return this._state.get('barStr');
  }

  setBarStr(barStr: string): Bar {
    return new Bar(this._state.set('barStr', barStr));
  }

  get barNum(): number {
    return this._state.get('barNum');
  }

  setBarNum(barNum: number): Bar {
    return new Bar(this._state.set('barNum', barNum));
  }
}
