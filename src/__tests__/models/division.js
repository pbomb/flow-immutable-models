// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../../../src/ImmutableModel';
import { Team } from './team';
import type { TeamModelType } from './team';

export type DivisionModelType = {
  name: 'Atlantic' | 'Metropolitan' | 'Central' | 'Pacific',
  teams: { [key: string]: TeamModelType },
};

const defaultDivisionValues: $Shape<DivisionModelType> = {
  teams: {},
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
  static fromJS(json: DivisionFromJSType): Division {
    const state: Object = Object.assign({}, defaultDivisionValues, json);
    state.teams = Immutable.Map(state.teams).map(item => Team.fromJS(item));
    return new this(Immutable.Map(state));
  }

  toJS(): DivisionModelType {
    return {
      name: this.name,
      teams: this.teams.map(item => item.toJS()).toObject(),
    };
  }

  get name(): 'Atlantic' | 'Metropolitan' | 'Central' | 'Pacific' {
    return this._state.get('name');
  }

  setName(name: 'Atlantic' | 'Metropolitan' | 'Central' | 'Pacific'): this {
    return this.clone(this._state.set('name', name));
  }

  get teams(): Immutable.Map<string, Team> {
    return this._state.get('teams');
  }

  setTeams(teams: Immutable.Map<string, Team>): this {
    return this.clone(this._state.set('teams', teams));
  }
}

type DivisionOptionalArguments = typeof defaultDivisionValues;
type DivisionRequiredArguments = { name: 'Atlantic' | 'Metropolitan' | 'Central' | 'Pacific' };
type DivisionFullType = DivisionOptionalArguments & DivisionRequiredArguments;
type DivisionFromJSType = $Shape<DivisionFullType> & DivisionRequiredArguments;
