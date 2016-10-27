// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../src/ImmutableModel';
import type { BarInterface } from './bar';
import { Bar, defaultBarValues } from './bar';

export type FooInterface = {
  str: string,
  num: number,
  bar: BarInterface,
  barAry: Array<BarInterface>,
  regArray: Array<boolean>,
  lst: Immutable.List<BarInterface>,
  maap: Immutable.Map<string, any>,
};

const defaultFooValues: $Shape<FooInterface> = {
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
  static fromJS(json: $Diff<FooInterface, typeof defaultFooValues>): Foo {
    // $FlowFixMe
    const state = Object.assign({}, defaultFooValues, json);

    return new Foo(Immutable.fromJS(state));
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

  get barAry(): Array<Bar> {
    return this._state.get('barAry');
  }

  setBarAry(barAry: Array<Bar>): Foo {
    return new Foo(this._state.set('barAry', barAry));
  }

  get regArray(): Array<boolean> {
    return this._state.get('regArray');
  }

  setRegArray(regArray: Array<boolean>): Foo {
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
