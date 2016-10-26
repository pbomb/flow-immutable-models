// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../src/ImmutableModel';

export type BarInterface = {
  barStr: string,
  barNum: number,
};

export const defaultBarValues: BarInterface = {
  barStr: 'foo',
  barNum: 3,
}

////////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above 
// and re-run the flow-immutable-models codemod
//
////////////////////////////////////////////////////////////////////////////////
export class Bar extends ImmutableModel {
  static fromJS(json: $Diff<BarInterface, typeof defaultBarValues>): Bar {
    // $FlowFixMe
    const state = Object.assign({}, defaultBarValues, json);

    return new Bar(Immutable.fromJS(state));
  }

  get barStr(): string {
    return this.get('barStr');
  }

  setBarStr(barStr: string): Bar {
    return this.set('barStr', barStr);
  }

  get barNum(): number {
    return this.get('barNum');
  }

  setBarNum(barNum: number): Bar {
    return this.set('barNum', barNum);
  }
}
