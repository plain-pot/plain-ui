import {App, VNode} from 'vue'
import * as CSS from 'csstype'

export type SimpleFunction = (...args: any[]) => any
export type ComponentPlugin = { install: (app: App) => void }

type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void | JSX.Element;
type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;
export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;

export type StyleProperties = CSS.Properties
export type FuncProps<T> = new() => T