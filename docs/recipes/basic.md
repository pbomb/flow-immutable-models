# Basic Example

In your repo, assume `models/User.js` exists as the following.
```js
// @flow
// Both of the following imports are required
import * as Immutable from 'immutable';
import ImmutableModel from 'flow-immutable-models';

export type UserModelType = {
  id: number,
  name: string,
};

```

Each exported type matching `*ModelType` (in this case `UserModelType`) must be described as an object literal. Otherwise, the script will throw an error. In these docs, we refer to these definitions as `ModelType`s

Running `jscodeshift -t /path/to/flow-immutable-models/lib/transform.js **/models/*.js` will update `models/User.js` to be
```js
// @flow
import * as Immutable from 'immutable'; // This is required
import ImmutableModel from 'flow-immutable-models'; // Make sure you copied this file into your repo

export type UserModelType = {
  id: number,
  name: string,
};

// /////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
// /////////////////////////////////////////////////////////////////////////////
export class User extends ImmutableModel {
  static fromJS(json: UserModelType): User {
    const state: Object = Object.assign({}, json);
    return new this(Immutable.Map(state));
  }

  toJS(): UserModelType {
    return {
      id: this.id,
      name: this.name,
    };
  }

  get id(): number {
    return this._state.get('id');
  }

  setId(id: number): this {
    return this.clone(this._state.set('id', id));
  }

  get name(): string {
    return this._state.get('name');
  }

  setName(name: string): this {
    return this.clone(this._state.set('name', name));
  }
}

```

Creating a new user model instance can be done using the fromJS static function. Here is an example:

```js
// Will generate Flow errors if object argument is not valid

const user: User = User.fromJS({
  id: 1,
  name: "Floyd O'Phone",
});
```

Once you have a `User` instance, you can get properties using property accessor syntax. For instance, the user's name can be retrieved with:

```js
const name = user.name;
console.log(name); // prints "Floyd O'Phone"
```

Setting a property will always return a new instance of `User`. This allows you to chain setters together while ensuring that an instance is never directly mutated.

```js
const user1 = User.fromJS({ id: 1, name: "Floyd O' Phone" });
const user2 = user1.setName("leeb");
console.log(user1 === user2); // prints "false"
console.log(user2.name); // prints "leeb"
```
