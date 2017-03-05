// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../../../src/ImmutableModel';

type Strength = string;

export type TeamModelType = {
  location: string,
  nickname: string,
  hasWonStanleyCup: boolean,
  lastCupWin: ?number,
  players: { [key: string]: number },
  strengths: Array<Strength>,
};

export const defaultTeamValues: $Shape<TeamModelType> = {
  players: {},
};

// /////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
// /////////////////////////////////////////////////////////////////////////////
export class Team extends ImmutableModel {
  static fromJS(json: TeamFromJSType): Team {
    const state: Object = Object.assign({}, defaultTeamValues, json);
    state.players = Immutable.Map(state.players);
    state.strengths = Immutable.List(state.strengths);
    return new this(Immutable.Map(state));
  }

  toJS(): TeamModelType {
    return {
      location: this.location,
      nickname: this.nickname,
      hasWonStanleyCup: this.hasWonStanleyCup,
      lastCupWin: this.lastCupWin,
      players: this.players.toObject(),
      strengths: this.strengths.toArray(),
    };
  }

  get location(): string {
    return this._state.get('location');
  }

  setLocation(location: string): this {
    return this.clone(this._state.set('location', location));
  }

  get nickname(): string {
    return this._state.get('nickname');
  }

  setNickname(nickname: string): this {
    return this.clone(this._state.set('nickname', nickname));
  }

  get hasWonStanleyCup(): boolean {
    return this._state.get('hasWonStanleyCup');
  }

  setHasWonStanleyCup(hasWonStanleyCup: boolean): this {
    return this.clone(this._state.set('hasWonStanleyCup', hasWonStanleyCup));
  }

  get lastCupWin(): ?number {
    return this._state.get('lastCupWin');
  }

  setLastCupWin(lastCupWin: ?number): this {
    return this.clone(this._state.set('lastCupWin', lastCupWin));
  }

  get players(): Immutable.Map<string, number> {
    return this._state.get('players');
  }

  setPlayers(players: Immutable.Map<string, number>): this {
    return this.clone(this._state.set('players', players));
  }

  get strengths(): Immutable.List<Strength> {
    return this._state.get('strengths');
  }

  setStrengths(strengths: Immutable.List<Strength>): this {
    return this.clone(this._state.set('strengths', strengths));
  }
}

type TeamOptionalArguments = typeof defaultTeamValues;

type TeamRequiredArguments = {
  location: string,
  nickname: string,
  hasWonStanleyCup: boolean,
  lastCupWin: ?number,
  strengths: Array<Strength>,
};

type TeamFullType = TeamOptionalArguments & TeamRequiredArguments;
type TeamFromJSType = $Shape<TeamFullType> & TeamRequiredArguments;
