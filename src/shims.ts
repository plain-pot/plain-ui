import {App, VNode, ComponentPublicInstance} from 'vue'
import * as CSS from 'csstype'

export type SimpleFunction = (...args: any[]) => any
export type ComponentPlugin = { install: (app: App) => void }

type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void | JSX.Element;
type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;
export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;

export type StyleProperties = { [k in keyof CSS.Properties]: string | number | undefined | null }
export type FuncProps<T> = new() => T

export type RequireFormat<T, P extends keyof T> = Required<{ [k in P]: T[k] }> & { [k in Exclude<keyof T, P>]: T[k] }

export interface HTMLInputEvent extends Event {target: HTMLInputElement & EventTarget;}

export type ReferenceType = ComponentPublicInstance | HTMLElement | (() => (ComponentPublicInstance | HTMLElement))

/*
type Test = { name?: string, age: number }
const a: RequireFormat<Test, 'name'> = {} as any

a.name.charAt(0)
a.age.toFixed(0)
*/
