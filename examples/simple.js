import * as Immutable from 'immutable';
import ImmutableModel from 'flow-immutable-models';

export type UserModelType = {
  id: number,
  name: string,
};

////////////////////////////////////////////////////////////////////////////////
//
// NOTE: EVERYTHING BELOW THIS COMMENT IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
////////////////////////////////////////////////////////////////////////////////
export class User extends ImmutableModel {
  static fromJS(json: UserModelType): User {
    const state = Object.assign({}, json);
    return new User(Immutable.fromJS(state));
  }

  get id(): number {
    return this._state.get('id');
  }

  setId(id: number): User {
    return new User(this._state.set('id', id));
  }

  get name(): string {
    return this._state.get('name');
  }

  setName(name: string): User {
    return new User(this._state.set('name', name));
  }
}
