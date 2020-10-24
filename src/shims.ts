import {App, VNode} from 'vue'

export type SimpleFunction = (...args: any[]) => any
export type ComponentPlugin = { install: (app: App) => void }

type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void | JSX.Element;
type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;
export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;