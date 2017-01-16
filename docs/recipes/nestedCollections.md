# Nested Collections

Let's say you'd like to have a model that contains a collection of values. You'd type your model using plain JS objects like an Array or Object map and the model class would convert them to Immutable.List and Immutable.Map, respectively.

## Nested Array -> Immutable.List

### Array of simple items

If you would like your model class to have a property which is a list of items, it's best to model the type's property as an Array of that type. When the model class is instantiated, the array will be converted into an immutable list of that type.

For example, if your model type is defined like this:
```js
export type MyListModelType {
  propA: Array<string>,
};
```
then the `propA` property of the model instance will be of type `Immutable.List<string>`. Here's how it would work:
```js
const myList = MyList.fromJS({
  propA: ['a', 'b', 'c']
});
const propA: Immutable.List<string> = myList.propA;
console.log(propA.first()); // prints 'a'
```

### Array of models

If you would like to have a model property be a list of other model instances, then you should define your type to have an Array of OtherModelType objects. When the model class is instantiated, the array will be converted into an immutable list of model instances. Here's how the ModelType should look:
```js
export type OtherModelType = {
  name: string,
};
export type MyListModelType = {
  others: Array<OtherModelType>,
};
```
Here's how you would use them:
```js
const myList = MyList.fromJS({
  others: [{ name: 'First' }, { name: 'Second' }],
});
console.log(myList.others.size); // prints 2
console.log(myList.others.get(1).name); // prints "Second"
```
Notice how `myList` was created from plain JS objects. No Immutable.List and no Other model instance. The call to `MyList.fromJS` will do the conversions to immutable collections and models for you.

*Note: You can define a ModelType property of type Immutable.List and the model will use it as is. Be aware that if the list contains ModelTypes, they will not be converted to model instances for you. That might change in a future version.*

## Nested Object Map -> Immutable.Map

It's nice when we can specify at design time all the properties (and their types) that a model might have. For this case, it's recommended to use the [Nested Model approach](./nestedModels.md). However, sometimes our models need to have dynamic properties, like when they act like a cache. To handle this scenario, calling `fromJS` automatically converts from plain-JS object maps to Immutable.Maps.
Here's an example ModelType with a cacheHits property that is an object map:
```js
export type MyMapModelType = {
  cacheHits: { [key: string]: number },
};
```
It can then be used like this:
```js
const myMap = MyMap.fromJS({
  cacheHits: {
    'abcd': 3,
  },
});
const cacheHits: Immutable.Map<string, number> = myMap.cacheHits;
console.log(cacheHits.get('abcd')); // prints 3

// Now add a new cacheHits entry

const nextMap = myMap.setCacheHits(cacheHits.set('efgh', 1));
console.log(nextMap.cacheHits.get('efgh')); // prints 1
console.log(nextMap.cacheHits.size); // prints 2
```
It's often desirable to have a Map property where the map values are other models. This library will automatically handle the conversion from ModelTypes for you like this:
```js
export type CacheStatsModelType = {
  hits: number,
  misses: number,
};
export type CacheModelType = {
  stats: { [key: string]: CacheStatsModelType },
};
```
And here's how it would be used:
```js
const cache = Cache.fromJS({
  stats: {}
});
const nextCache = cache.setStats(cache.stats.set('abcd', CacheStats.fromJS({
  hits: 0,
  misses: 1,
})));
const abcdStats: CacheStats = nextCache.stats.get('abcd');
console.log(abcdStats.misses); // prints 1
```
