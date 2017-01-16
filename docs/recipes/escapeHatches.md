# Escape Hatches

While it's great to always be able to make typed calls to retrieve data from or mutate models, sometimes we need to generically access values or optimize for performance. For these reasons, model instances are _mostly_ compatible with the [Immutable.Map API](http://facebook.github.io/immutable-js/docs/#/Map).

It's recommended to not use these escape hatches unless it's really the best approach as they are not type-safe and cannot be statically analyzed well.

The following are some examples. For each example, assume this ModelType:

```js
export type ProductModelType {
  name: string,
  userCount: number,
  revenue: number,
};
export type StartupModelType = {
  name: string,
  ventureCapital: number,
  products: Array<ProductModelType>,
};
```

### Dynamically accessing properties at runtime

In this example, there is a ProductTable React component that can be passed the products and the columns which should be displayed. Since we don't know those columns at design time, we need to be able to dynamically retrieve them from each Product instance. We do this using the `get` method, which has the same API as [Immutable.Map#get](http://facebook.github.io/immutable-js/docs/#/Map/get). This example also shows how models expose the `set` method.

```js
type Props = {
  products: Immutable.List<Product>,
  visibleColumns: Array<string>,
};

export default function ProductTable(
  { visibleColumns, products }: Props
): React.Element<*> {
  return (
    <table>
      <tbody>
        {
          products.map((product) => {
            return (
              <tr>
                {
                  visibleColumns.map(
                    col => <td>{ product.get(col) }</td>
                  )
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}

const startup = Startup.fromJS({
  name: 'DatStartupTho',
  ventureCapital: 500000,
  products: [
    {
      name: 'Monitoring',
      userCount: 150000,
      revenue: 1000000,
    },
    {
      name: 'Metrics',
      userCount: 200000,
      revenue: 2000000,
    },
  ]
});
const visibleProductColumns = ['name', 'userCount'];
const reactTable = <ProductTable products={ startup.products } visibleColumns={ visibleProductColumns }/>;

// example usage of set
let update = { prop: 'ventureCapital', value: 2000000 };
let nextStartup = startup.set(update.prop, update.value);
console.log(nextStartup.ventureCapital); // prints 2000000```

### Nested property access

Just like the above example, which used the `get` and `set` methods, models also expose the `getIn` and `setIn` methods, which can be used like this:
```js
const startup = Startup.fromJS({
  name: 'DatStartupTho',
  ventureCapital: 500000,
  products: [
    {
      name: 'Monitoring',
      userCount: 150000,
      revenue: 1000000,
    },
    {
      name: 'Metrics',
      userCount: 200000,
      revenue: 2000000,
    },
  ]
});

// example usage of getIn
console.log(startup.getIn(['products', 1, 'name'])); // prints "Metrics"

// example usage of setIn
update = { prop: 'userCount', value: 50000 };
nextStartup = startup.setIn(['products', 0, update.prop], update.value);
console.log(nextStartup.products.get(0).userCount); // prints 50000

```

### Collection convenience operations

#### addToMap and removeFromMap

If you would like to add a key/value pair to a property which is an Immutable.Map, you can use the `addToMap` method. Conversely, you can remove a key/value pair using the `removeFromMap` method.

```js
export type HasMapModelType = {
  mapProp: { [key: string]: number },
};

const hasMap = HasMap.fromJS({
  mapProp: {},
});
const addedToMap = hasMap.addToMap('mapProp', 'a', 5);
console.log(addedToMap.mapProp.get('a')); // prints 5

const removedFromMap = addedToMap.removeFromMap('mapProp', 'a');
console.log(removedFromMap.mapProp.size); // prints 0
```

#### addToList, concatToList and removeFromList

If you would like to add items to a property which is an Immutable.List, you can use the `addToList` or `concatToList` methods. Conversely, you can remove items using the `removeFromList` method.

```js
export type HasListModelType = {
  listProp: Array<number>,
};

const hasList = HasList.fromJS({
  listProp: [1, 2],
});
const addedToList = hasList.addToList('listProp', 3);
console.log(addedToList.listProp.toArray()); // prints [1, 2, 3]

const concattedToList = addedToList.concatToList(4, 5, 6);
console.log(addedToList.listProp.toArray()); // prints [1, 2, 3, 4, 5, 6]

const removedFromList = concattedToList.removeFromList('listProp', 1);
console.log(removedFromList.listProp.toArray()); // prints [1, 3, 4, 5, 6]
```

### Other exposed Immutable.Map methods

* [update](http://facebook.github.io/immutable-js/docs/#/Map/update)
* [updateIn](http://facebook.github.io/immutable-js/docs/#/Map/updateIn)
* [has](http://facebook.github.io/immutable-js/docs/#/Map/has)
* [equals](http://facebook.github.io/immutable-js/docs/#/Map/equals)
