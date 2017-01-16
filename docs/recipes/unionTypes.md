# Union Types

Union types can be a helpful when a property can be of different types. For instance, here's an example:
```js
export type FilterModelType = {
  property: string,
  operator: '<' | '=' | '>',
  value: string,
};
```
With this model type, we can enforce that an operator must be of a valid string.
```js
// Flow will not complain about this
const filter = Filter.fromJS({
  property: 'name',
  operator: '=',
  value: 'jordanIsNotaFunction',
});

// Flow will complain about this due to an invalid operator
const badFilter = Filter.fromJS({
  property: 'name',
  operator: 'contains',
  value: 'soprano',
});
```
Unfortunately, this library cannot help with automatically converting from ModelTypes to model instances when they are used within union types as it can't know which model class to convert from. For instance, given this ModelType:
```js
export type UnionModelType = {
  prop: OtherModelType | AnotherModelType,
};
```
the library can't know if the UnionModelType passed into `Union.fromJS` has a prop that is of type OtherModelType or AnotherModelType at runtime. So, it won't do any conversion and the type of the `prop` property is not converted to `Other | Another`, but rather remains as `OtherModelType | AnotherModelType`.
