// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../src/ImmutableModel';
import type { BarModelType } from './bar';
import { Bar, defaultBarValues } from './bar';

export type FooModelType = {
  str: string,
  num: number,
  bar: BarModelType,
  barAry: Array<BarModelType>,
  regArray: Array<boolean>,
  lst: Immutable.List<BarModelType>,
  maap: Immutable.Map<string, any>,
};

const defaultFooValues: $Shape<FooModelType> = {
  str: 'strInitial',
  bar: defaultBarValues,
  lst: Immutable.List(),
  maap: Immutable.Map(),
};

////////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS CLASS IS GENERATED. DO NOT MAKE CHANGES HERE.
//
// If you need to update this class, update the corresponding flow type above
// and re-run the flow-immutable-models codemod
//
////////////////////////////////////////////////////////////////////////////////
export class Foo extends ImmutableModel {
  static fromJS(json: $Diff<FooModelType, typeof defaultFooValues>): Foo {
    // $FlowFixMe
    const state: Object = Object.assign({}, defaultFooValues, json);

    state.bar = Bar.fromJS(state.bar);
    state.barAry = state.barAry.map(item => Bar.fromJS(item));
    return new this(Immutable.fromJS(state));
  }

  get str(): string {
    return this._state.get('str');
  }

  setStr(str: string): Foo {
    return new Foo(this._state.set('str', str));
  }

  get num(): number {
    return this._state.get('num');
  }

  setNum(num: number): Foo {
    return new Foo(this._state.set('num', num));
  }

  get bar(): Bar {
    return this._state.get('bar');
  }

  setBar(bar: Bar): Foo {
    return new Foo(this._state.set('bar', bar));
  }

  get barAry(): Immutable.List<Bar> {
    return this._state.get('barAry');
  }

  setBarAry(barAry: Immutable.List<Bar>): Foo {
    return new Foo(this._state.set('barAry', barAry));
  }

  get regArray(): Immutable.List<boolean> {
    return this._state.get('regArray');
  }

  setRegArray(regArray: Immutable.List<boolean>): Foo {
    return new Foo(this._state.set('regArray', regArray));
  }

  get lst(): Immutable.List<Bar> {
    return this._state.get('lst');
  }

  setLst(lst: Immutable.List<Bar>): Foo {
    return new Foo(this._state.set('lst', lst));
  }

  get maap(): Immutable.Map<string, any> {
    return this._state.get('maap');
  }

  setMaap(maap: Immutable.Map<string, any>): Foo {
    return new Foo(this._state.set('maap', maap));
  }
}
