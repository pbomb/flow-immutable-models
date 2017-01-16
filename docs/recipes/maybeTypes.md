# Maybe Types

It's common for a model type to have properties whose value can sometimes be null or undefined. One way Flow allows for this is using [Maybe Types](https://flowtype.org/docs/nullable-types.html#_). Here's an example where the `ipoPrice` property can be a number, null or undefined:
```js
export type StartupModelType = {
  name: string,
  ipoPrice: ?number,
};
```
Here are some valid ways to construct a new startup instance:
```js
// ipoPrice is a number
const postIPO = Startup.fromJS({
  name: 'Post IPO',
  ipoPrice: 14.37,
});
const acquisition = Startup.fromJS({
  name: 'Acquisition',
  ipoPrice: null,
});
const seriesA = Startup.fromJS({
  name: 'Series A',
  ipoPrice: undefined,
});
```
Note that in each case, it's required for the `ipoPrice` property to exist, even if it's value is undefined or null. However, there's another way to define the `ipoPrice` property such that it is an [optional property](https://flowtype.org/docs/objects.html#optional-properties).
```js
export type StartupModelType = {
  name: string,
  ipoPrice?: number,
};
```
With this approach, the `ipoPrice` property is now optional and we can create model instances like this:
```js
const seriesB = Startup.fromJS({
  name: 'Series B',
});
console.log(seriesB.ipoPrice); // prints undefined
```

### Maybe Collections

It's also possible to use Maybe Types for collections. However, it's preferred to not do this and represent the absence of values as an empty list or map. Here's an example of using a maybe type:
```js
export type StartupModelType = {
  name: string,
  investors?: Array<string>,
};
```
Now we can create and use a startup like this:
```js
const bootstrappedStartup = Startup.fromJS({
  name: 'Stealth',
});
console.log(bootstrappedStartup.investors); // prints undefined

const boulderStartup = Startup.fromJS({
  name: 'Bolder Boulder',
  investors: ['Foundry Group', 'Boulder Ventures'],
});
const investors: Immutable.List<string> = boulderStartup.investors;
console.log(investors.get(1)); // prints "Boulder Ventures"
```
