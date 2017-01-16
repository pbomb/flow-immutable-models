## flow-immutable-models

[![Stories in Ready](https://badge.waffle.io/pbomb/flow-immutable-models.svg?label=ready&title=Ready)](http://waffle.io/pbomb/flow-immutable-models)

This repository contains a codemod script for use with
[JSCodeshift](https://github.com/facebook/jscodeshift) that creates model classes backed by [Immutable.js](http://facebook.github.io/immutable-js/) data structures based on [Flow](https://flowtype.org) type aliases.

# Motivation

Immutable collections are great for simplifying application development by avoid object mutations and enabling performance optimizations such as memoization and reference equality comparisons. A popular immutable collection library is [Immutable.js](http://facebook.github.io/immutable-js/).

One downside to using Immutable.js collections (Immutable.List, Immutable.Map, etc.) is that the objects do not lend themselves to static analysis / typing with tools like [Flow](https://flowtype.org) or [TypeScript](https://www.typescriptlang.org/). For example, with Flow we often end up typing Maps like `Immutable.Map<string, any>`; This means that the map contains unknown keys of type string values can be of any kind. It says nothing about which keys are allowed and what type a value for a given key should be. While there are some ways of providing better typing than this, there are still gaps in how well these objects can be described.

This codemod library takes the approach of wrapping an `Immutable.Map` with a typed ES6 class definition. As a consumer, you would create files with exported Flow type definitions described as an Object with defined keys and values. Running this codemod against these files creates an ES6 class with getters and setters for each typed property. Each setter function returns a new instance of the class so that you can continue to take advantage of performance optimizations like memoization and reference equality checking since the class instances are immutable.

# Getting Started

Follow these steps to install this library as a dependency in your application.

### If using yarn

  * `yarn add flow-immutable-models`

### If using npm    
  * `npm install --save flow-immutable-models`

### Executing the codemod script

```sh
jscodeshift -t node_modules/flow-immutable-models/lib/transform.js <path>... [options]
```

Use the `-d` option for a dry-run and use `-p` to print the output for comparison. For more information about the jscodeshift CLI options, check out its [README](https://github.com/facebook/jscodeshift#usage-cli).

# How it works

This codemod modifies any file that exports Flow type declarations named like `*ModelType`. For each matching exported Flow type, a model class will be created later in the file. If this script is re-run and the model class already exists, it will be updated to reflect any changes to the describing ModelType, meaning it is safe to run this script multiple times against the same files.

It's also possible to nest ModelTypes together or to define properties to be collections. The way to do this is to describe the ModelType purely as JS Objects and Arrays and the library will create model classes that will convert the plain-JS objects into Immutable.js collections as necessary.

For more information, please read through the various recipes, starting with the Basic one, to see how it works.

# Recipes

* [Basic example](./docs/recipes/basic.md)
* [Nested Models](./docs/recipes/nestedModels.md)
* [Nested Collections](./docs/recipes/nestedCollections.md)
* [Default Values](./docs/recipes/defaultValues.md)
* [Maybe Types](./docs/recipes/maybeTypes.md
* [Union Types](./docs/recipes/unionTypes.md)
* [Serializing to plain-JS](./docs/recipes/toJS.md)
* [Escape Hatches](./docs/recipes/escapeHatches.md)

### CLI Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through the `printOptions` command line argument

```sh
jscodeshift -t transform.js <path> --printOptions='{ "quote":"double" }'
```

The default options are
```js
{ "quote": "single": "trailingComma": true }
```
