import {App, VNode} from 'vue'
import * as CSS from 'csstype'

export type SimpleFunction = (...args: any[]) => any
export type ComponentPlugin = { install: (app: App) => void }

type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void | JSX.Element;
type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;
export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;

export type StyleProperties = { [k in keyof CSS.Properties]: string | number | undefined | null }
export type FuncProps<T> = new() => T

export type RequireFormat<T, P extends keyof T> = Required<{ [k in P]: T[k] }>
