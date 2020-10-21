import {App} from 'vue'

export type SimpleFunction = (...args: any[]) => any
export type ComponentPlugin = { install: (app: App) => void }