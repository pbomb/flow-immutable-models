// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../../../src/ImmutableModel';
import { Team } from './team';
import type { TeamModelType } from './team';

export type DivisionModelType = {
  name: string,
  teams: Array<TeamModelType>,
};

const defaultDivisionValues: $Shape<DivisionModelType> = {
  teams: [],
};

// /////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
// /////////////////////////////////////////////////////////////////////////////
export class Division extends ImmutableModel {
  static fromJS(json: $Diff<DivisionModelType, typeof defaultDivisionValues>): Division {
    // $FlowFixMe
    const state: Object = Object.assign({}, defaultDivisionValues, json);

    state.teams = state.teams.map(item => Team.fromJS(item));
    return new this(Immutable.fromJS(state));
  }

  toJS(): DivisionModelType {
    return {
      name: this.name,
      teams: this.teams.toArray().map(item => item.toJS()),
    };
  }

  get name(): string {
    return this._state.get('name');
  }

  setName(name: string): this {
    return this.clone(this._state.set('name', name));
  }

  get teams(): Immutable.List<Team> {
    return this._state.get('teams');
  }

  setTeams(teams: Immutable.List<Team>): this {
    return this.clone(this._state.set('teams', teams));
  }
}
