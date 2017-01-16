# Default Values

Always having to specify all the values when creating a model can be burdensome on consumers. To lessen the pain, you can specify default values, where appropriate. In these cases, the consumer is only required to pass to `fromJS` an object that contains properties in the ModelType that do not have default values.

The default values are known based on their name. For instance, if you have a file user.js that exports `UserModelType`, then you would name the default values as `userDefaultValues`. For example, given the following ModelType with default values specified:

```js
export type UserModelType = {
  firstName: string,
  lastName: string,
  isBetaTester: boolean,
};

const defaultUserValues: $Shape<UserModelType> = {
  isBetaTester: false,
};
```

Then consumers are not required to specify the `isBetaTester` property, like this:
```js
const user = User.fromJS({ first: 'Tom', last: 'Occhino' });
console.log(user.isBetaTester); // prints false
```

Default values are useful for properties with sensible defaults and often times with collections. For example, an object map can be defaulted with an empty object `{}` and an Array can, likewise, be defaulted with an empty array `[]`.
