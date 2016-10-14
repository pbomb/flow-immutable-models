## flow-immutable-models

This repository contains a codemod script for use with
[JSCodeshift](https://github.com/facebook/jscodeshift) that creates model classes backed by [Immutable.js](http://facebook.github.io/immutable-js/) data structures based on [Flow](https://flowtype.org) type interfaces.

### Setup with yarn

  * `yarn global add jscodeshift`
  * `git clone https://github.com/pbomb/flow-immutable-models.git` or download a zip file
    from `https://github.com/pbomb/flow-immutable-models/archive/master.zip`
  * Run `yarn install` in the flow-immutable-models directory
  * Copy the ImmutableModel.js base class into your repository

### Setup with npm    
  * `npm install -g jscodeshift`
  * `git clone https://github.com/pbomb/flow-immutable-models.git` or download a zip file
    from `https://github.com/pbomb/flow-immutable-models/archive/master.zip`
  * Run `npm install` in the flow-immutable-models directory
  * Copy the ImmutableModel.js base class into your repository

### Executing the codemod script

```sh
cp /path/to/flow-immutable-models/src/ImmutableModel.js src/models
jscodeshift -t /path/to/flow-immutable-models/src/transform.js <path>
```

Use the `-d` option for a dry-run and use `-p` to print the output for comparison. For more information about the jscodeshift CLI options, check out its [README](https://github.com/facebook/jscodeshift#usage-cli).

### How it works

This codemod modifies any file that exports Flow type declarations named like `*Interface`. For each matching exported Flow type, a model class will be created. If this script is re-run and the model class already exists, it will be processed again and replaced, meaning it is safe to run this script multiple times against the same files.

### Class design

Immutable collections are great for simplifying application development by avoid object mutations and enabling performance optimizations such as memoization and reference equality comparisons. A popular immutable collection library is [Immutable.js](http://facebook.github.io/immutable-js/).

One downside to using Immutable.js collections (Immutable.List, Immutable.Map, etc.) is that the objects do not lend themselves to static analysis / typing with tools like [Flow](https://flowtype.org) or [TypeScript](https://www.typescriptlang.org/). For example, with Flow we often end up typing Maps like `Immutable.Map<string, any>`; This means that the map contains unknown keys of type string values can be of any kind. It says nothing about which keys are allowed and what type a value for a given key should be. While there are some ways of providing better typing than this, there are still gaps in how well these objects can be desribed.

This codemod library takes the approach of wrapping an `Immutable.Map` with a typed ES6 class definition. As a consumer, you would create files with exported Flow type definitions described as an Object with defined keys and values. Running this codemod against these files creates an ES6 class with getters and setters for each typed property. Each setter function returns a new instance of the class so that you can continue to take advantage of performance optimizations like memoization and reference equality checking since the class instances are immutable.

### Examples

In your repo, `models/User.js` exists as
```js
// @flow
import * as Immutable from 'immutable'; // This is required
import ImmutableModel from './ImmutableModel.js'; // Make sure you copied this file into your repo

export type UserInterface = {
  id: number,
  name: string,
  address: AddressInterface,
};

```

Each exported type matching `*Interface` (in this case `UserInterface`) must be described as an object literal. Otherwise, the script will throw an error.

Running `jscodeshift -t /path/to/flow-immutable-models/src/transform.js **/models/*.js` will update `models/User.js` to be
```js
// @flow
import * as Immutable from 'immutable'; // This is required
import ImmutableModel from './ImmutableModel.js'; // Make sure you copied this file into your repo

export type UserInterface = {
  id: number,
  name: string,
};

export class User extends ImmutableModel {
  static fromJS(state: UserInterface): User {
    return this.fromImmutable(Immutable.fromJS(state));
  }

  static fromImmutable(ImmutableModel: Immutable.Map<string, any>): User {
    return new User(ImmutableModel);
  }

  initialize(): Immutable.Map<string, any> {
    let state = Immutable.Map();
    return state;
  }

  get id(): number {
    return this._state.get('id');
  }

  setId(id: number): User {
    return new User(this._state.set('id'));
  }

  get name(): string {
    return this._state.get('name');
  }

  setName(name: string): User {
    return new User(this._state.set('name'));
  }
}

```

Creating a new user can be done a few different ways. Here are some examples:

```js
// Will generate Flow errors if object argument is not valid

const user = User.fromJS({
  id: 1,
  name: "Floyd O' Phone",
});
```
```js
// Will not generate Flow errors if Map argument is not valid
// because Immutable.js collections cannot be typed well

const user = User.fromImmutable(
  Immutable.Map(
    {
      id: 1,
      name: "Floyd O' Phone",
    }
  )
);
```
```js
// Will generate Flow errors if function call arguments are not valid

const user = new User()
  .setId(1)
  .setName("Floyd O' Phone");
```

Once you have a `User` instance, you can get properties using property accessor syntax. For instance, the user's name can be retrieved with:

```js
const name = user.name;
```

Setting a property will always return a new instance of `User`.

```js
const user1 = User.fromJS({ id: 1, name: "Floyd O' Phone"});
const user2 = user1.setName("leeb");
console.log(user1 === user2); // prints "false"
```

#### Nested Objects

If you want to have a nested model class, each nested object should be declared as its own type.

Example:

```js
export type User {
  name: string,
};

export type GithubIssue {
  author: User,
  body: string,
  title: string,
}
```

Then you can interact with the generated models like this:

```js
const issue = GithubIssue.fromJS({
  author: {
    name: "kittens"
  },
  title: "Yarn is too fast",
  body: "I can no longer sword-fight while installing dependencies: https://xkcd.com/303/"
});

console.log(issue.author.name); // prints "kittens"

const updatedIssue = issue.setAuthor(issue.author.setName("thejameskyle"));

console.log(updatedIssue.author.name); // prints "thejameskyle";
```

### Recast Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through the `printOptions` command line argument

```sh
jscodeshift -t transform.js <path> --printOptions='{ "quote":"double" }'
```

The default options are
```js
{ "quote": "single": "trailingComma": true }
```
