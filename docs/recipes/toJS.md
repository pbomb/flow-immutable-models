# Serializing models to plain-JS

It can be useful to convert ImmutableModel instances to plain JS objects. This can be done by calling the `toJS` instance method. This will return an object of that model's ModelType. This means that immutable Lists and Maps will be converted to plain JS Arrays and Objects, respectively. Nested models will be converted to their plain-JS ModelType representation, even if they are contains within immutable collections.
