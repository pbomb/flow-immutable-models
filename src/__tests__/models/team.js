// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../../../src/ImmutableModel';

export type TeamModelType = {
  location: string,
  nickname: string,
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
  static fromJS(json: TeamModelType): Team {
    const state: Object = Object.assign({}, json);
    return new this(Immutable.fromJS(state));
  }

  get location(): string {
    return this._state.get('location');
  }

  setLocation(location: string): Team {
    return new Team(this._state.set('location', location));
  }

  get nickname(): string {
    return this._state.get('nickname');
  }

  setNickname(nickname: string): Team {
    return new Team(this._state.set('nickname', nickname));
  }
}
