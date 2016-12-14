// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../../../src/ImmutableModel';
import { Division } from './division';
import type { DivisionModelType } from './division';

export type LeagueModelType = {
  name: string,
  divisions: Array<DivisionModelType>,
};

const defaultLeagueValues: $Shape<LeagueModelType> = {
  divisions: [],
};

// /////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
// /////////////////////////////////////////////////////////////////////////////
export class League extends ImmutableModel {
  static fromJS(json: $Diff<LeagueModelType, typeof defaultLeagueValues>): League {
    // $FlowFixMe
    const state: Object = Object.assign({}, defaultLeagueValues, json);

    state.divisions = state.divisions.map(item => Division.fromJS(item));
    return new this(Immutable.fromJS(state));
  }

  get name(): string {
    return this._state.get('name');
  }

  setName(name: string): League {
    return new League(this._state.set('name', name));
  }

  get divisions(): Immutable.List<Division> {
    return this._state.get('divisions');
  }

  setDivisions(divisions: Immutable.List<Division>): League {
    return new League(this._state.set('divisions', divisions));
  }
}
