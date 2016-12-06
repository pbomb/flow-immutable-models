// @flow
import * as Immutable from 'immutable';

export type Updater<TProp> = (oldValue: TProp) => TProp;

export default class ImmutableModel {
  _state: Immutable.Map<string, any>;

  constructor(state: Immutable.Map<string, any>) {
    this._state = state;
  }

  getState() {
    return this._state;
  }

  clone(value: Immutable.Map<string, any>): this {
    const constructor = this.constructor;
    return value === this._state ? this : new constructor(value);
  }

  get(property: string): any {
    return this._state.get(property);
  }

  set(property: string, value: any): this {
    return this.clone(this._state.set(property, value));
  }

  getIn(properties: string[]): any{
      return this._state.getIn(properties);
  }

  setIn(properties: string[], value: any): this{
      return this.clone(this._state.setIn(properties, value));
  }

  has(property: string): boolean {
    return this._state.has(property);
  }

  equals(other: any): boolean {
    return this._state.equals(other);
  }

  addToMap<TKey, TValue>(property: string, key: TKey, value: TValue): this {
    const map: Immutable.Map<TKey, TValue> = this.get(property);
    return this.clone(this._state.set(property, map.set(key, value)));
  }

  removeFromMap<TKey, TValue>(property: string, key: TKey): this {
    const map: Immutable.Map<TKey, TValue> = this.get(property);
    return this.clone(this._state.set(property, map.remove(key)));
  }

  update<TProp>(property: string, updater: Updater<TProp>): this {
    return this.clone(this._state.update(property, updater));
  }

  addToList<TProp>(property: string, value: TProp): this {
    return this.clone(this._state.update(property, Immutable.List(), lst => lst.push(value)));
  }

  concatToList<TProp>(property: string, value: TProp): this {
    return this.clone(this._state.update(property, Immutable.List(), lst => lst.concat(value)));
  }

  removeFromList<TProp>(property: string, index: number): this {
    const list: Immutable.List<TProp> = this.get(property);
    return this.clone(this._state.set(property, list.remove(index)));
  }

  addToSet<TProp>(property: string, value: TProp): this {
    const collection: Immutable.Set<TProp> = this.get(property);
    return this.clone(this._state.set(property, collection.add(value)));
  }

  removeFromSet<TProp>(property: string, value: TProp): this {
    const list: Immutable.Set<TProp> = this.get(property);
    return this.clone(this._state.set(property, list.remove(value)));
  }
}
