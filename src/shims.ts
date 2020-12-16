import {App, VNode, ComponentPublicInstance} from 'vue'
import * as CSS from 'csstype'

/*---------------------------------------vue-------------------------------------------*/

export type ComponentPlugin = { install: (app: App) => void }
type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void | JSX.Element;
type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;
export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;

/*---------------------------------------basic-------------------------------------------*/

export type SimpleFunction = (...args: any[]) => any
export type SimpleObject = Record<string, any>
export type StyleProperties = { [k in keyof CSS.Properties]: string | number | undefined | null }

/*---------------------------------------utils-------------------------------------------*/

export type RequireFormat<T, P extends keyof T> = Required<{ [k in P]: T[k] }> & { [k in Exclude<keyof T, P>]: T[k] }

/*---------------------------------------comopnent-------------------------------------------*/

export interface HTMLInputEvent extends Event {target: HTMLInputElement & EventTarget;}

export type ReferenceType = ComponentPublicInstance | HTMLElement | (() => (ComponentPublicInstance | HTMLElement))
export type ModelType = { value: any }
/*
type Test = { name?: string, age: number }
const a: RequireFormat<Test, 'name'> = {} as any

a.name.charAt(0)
a.age.toFixed(0)
*/
