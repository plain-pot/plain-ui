import Vue$1, {VueConstructor, ComponentOptions, VNode, CreateElement} from 'vue';
import {VueConstructor as VueConstructor$1} from 'vue/types/umd';

export type Data = {
    [key: string]: unknown;
};

export type ComponentPropsOptions<P = Data> = ComponentObjectPropsOptions<P> | string[];
declare type ComponentObjectPropsOptions<P = Data> = {
    [K in keyof P]: Prop<P[K]> | null;
};
declare type Prop<T> = PropOptions<T> | PropType<T>;
declare type DefaultFactory<T> = () => T | null | undefined;

interface PropOptions<T = any> {
    type?: PropType<T> | true | null;
    required?: boolean;
    default?: T | DefaultFactory<T> | null | undefined;

    validator?(value: unknown): boolean;
}

declare type PropType<T> = PropConstructor<T> | PropConstructor<T>[];
declare type PropConstructor<T> = {
    new(...args: any[]): T & object;
} | {
    (): T;
} | {
    new(...args: string[]): Function;
};
declare type RequiredKeys<T, MakeDefaultRequired> = {
    [K in keyof T]: T[K] extends {
        required: true;
    } | (MakeDefaultRequired extends true ? {
        default: any;
    } : never) ? K : never;
}[keyof T];
declare type OptionalKeys<T, MakeDefaultRequired> = Exclude<keyof T, RequiredKeys<T, MakeDefaultRequired>>;
declare type ExtractFunctionPropType<T extends Function, TArgs extends Array<any> = any[], TResult = any> = T extends (...args: TArgs) => TResult ? T : never;
declare type ExtractCorrectPropType<T> = T extends Function ? ExtractFunctionPropType<T> : Exclude<T, Function>;
declare type InferPropType<T> = T extends null ? any : T extends {
    type: null | true;
} ? any : T extends ObjectConstructor | {
    type: ObjectConstructor;
} ? {
    [key: string]: any;
} : T extends BooleanConstructor | {
    type: BooleanConstructor;
} ? boolean : T extends FunctionConstructor ? Function : T extends Prop<infer V> ? ExtractCorrectPropType<V> : T;
declare type ExtractPropTypes<O, MakeDefaultRequired extends boolean = true> = O extends object ? {
    [K in RequiredKeys<O, MakeDefaultRequired>]: InferPropType<O[K]>;
} & {
    [K in OptionalKeys<O, MakeDefaultRequired>]?: InferPropType<O[K]>;
} : {
    [K in string]: any;
};

declare type ComponentInstance = InstanceType<VueConstructor>;
declare type ComponentRenderProxy<P = {}, // props type extracted from props option
    B = {}, // raw bindings returned from setup()
    D = {}, // return from data()
    C extends ComputedOptions = {}, M extends MethodOptions = {}, PublicProps = P> = {
    $data: D;
    $props: Readonly<P & PublicProps>;
    $attrs: Data;
} & Readonly<P> & ShallowUnwrapRef<B> & D & M & ExtractComputedReturns<C> & Omit<Vue$1, '$data' | '$props' | '$attrs'>;
declare type VueConstructorProxy<PropsOptions, RawBindings> = VueConstructor & {
    new(...args: any[]): ComponentRenderProxy<ExtractPropTypes<PropsOptions>, ShallowUnwrapRef<RawBindings>, ExtractPropTypes<PropsOptions, false>>;
};
declare type DefaultData<V> = object | ((this: V) => object);
declare type DefaultMethods<V> = {
    [key: string]: (this: V, ...args: any[]) => any;
};
declare type DefaultComputed = {
    [key: string]: any;
};
declare type VueProxy<PropsOptions, RawBindings, Data = DefaultData<Vue$1>, Computed = DefaultComputed, Methods = DefaultMethods<Vue$1>> = ComponentOptions<Vue$1, ShallowUnwrapRef<RawBindings> & Data, Methods, Computed, PropsOptions, ExtractPropTypes<PropsOptions, false>> & VueConstructorProxy<PropsOptions, RawBindings>;

interface SetupContext {
    readonly attrs: Record<string, string>;
    readonly slots: {
        [key: string]: (...args: any[]) => VNode[];
    };
    readonly parent: ComponentInstance | null;
    readonly root: ComponentInstance;
    readonly listeners: {
        [key: string]: Function;
    };

    emit(event: string, ...args: any[]): void;
}

declare type ComputedGetter<T> = (ctx?: any) => T;
declare type ComputedSetter<T> = (v: T) => void;

interface WritableComputedOptions<T> {
    get: ComputedGetter<T>;
    set: ComputedSetter<T>;
}

export type ComputedOptions = Record<string, ComputedGetter<any> | WritableComputedOptions<any>>;

export interface MethodOptions {
    [key: string]: Function;
}

export type SetupFunction<Props, RawBindings = {}> = (this: void, props: Props, ctx: SetupContext) => RawBindings | (() => VNode | null) | void;

export interface ComponentOptionsBase<Props, D = Data, C extends ComputedOptions = {}, M extends MethodOptions = {}> extends Omit<ComponentOptions<Vue, D, M, C, Props>, 'data' | 'computed' | 'method' | 'setup' | 'props'> {
    data?: (this: Props, vm: Props) => D;
    computed?: C;
    methods?: M;
}

declare type ExtractComputedReturns<T extends any> = {
    [key in keyof T]: T[key] extends {
        get: (...args: any[]) => infer TReturn;
    } ? TReturn : T[key] extends (...args: any[]) => infer TReturn ? TReturn : never;
};
export type ComponentOptionsWithProps<PropsOptions = ComponentPropsOptions, RawBindings = Data, D = Data, C extends ComputedOptions = {}, M extends MethodOptions = {}, Props = ExtractPropTypes<PropsOptions>> = ComponentOptionsBase<Props, D, C, M> & {
    props?: PropsOptions;
    setup?: SetupFunction<Props, RawBindings>;
} & ThisType<ComponentRenderProxy<Props, RawBindings, D, C, M>>;
declare type ComponentOptionsWithArrayProps<PropNames extends string = string, RawBindings = Data, D = Data, C extends ComputedOptions = {}, M extends MethodOptions = {}, Props = Readonly<{
    [key in PropNames]?: any;
}>> = ComponentOptionsBase<Props, D, C, M> & {
    props?: PropNames[];
    setup?: SetupFunction<Props, RawBindings>;
} & ThisType<ComponentRenderProxy<Props, RawBindings, D, C, M>>;
declare type ComponentOptionsWithoutProps<Props = unknown, RawBindings = Data, D = Data, C extends ComputedOptions = {}, M extends MethodOptions = {}> = ComponentOptionsBase<Props, D, C, M> & {
    props?: undefined;
    setup?: SetupFunction<Props, RawBindings>;
} & ThisType<ComponentRenderProxy<Props, RawBindings, D, C, M>>;

declare type Equal<Left, Right> = (<U>() => U extends Left ? 1 : 0) extends (<U>() => U extends Right ? 1 : 0) ? true : false;
export type HasDefined<T> = Equal<T, unknown> extends true ? false : true;

declare function defineComponent<RawBindings, D = Data, C extends ComputedOptions = {}, M extends MethodOptions = {}>(options: ComponentOptionsWithoutProps<unknown, RawBindings, D, C, M>): VueProxy<unknown, RawBindings, D, C, M>;
declare function defineComponent<PropNames extends string, RawBindings = Data, D = Data, C extends ComputedOptions = {}, M extends MethodOptions = {}, PropsOptions extends ComponentPropsOptions = ComponentPropsOptions>(options: ComponentOptionsWithArrayProps<PropNames, RawBindings, D, C, M>): VueProxy<Readonly<{
    [key in PropNames]?: any;
}>, RawBindings, D, C, M>;
declare function defineComponent<Props, RawBindings = Data, D = Data, C extends ComputedOptions = {}, M extends MethodOptions = {}, PropsOptions extends ComponentPropsOptions = ComponentPropsOptions>(options: HasDefined<Props> extends true ? ComponentOptionsWithProps<PropsOptions, RawBindings, D, C, M, Props> : ComponentOptionsWithProps<PropsOptions, RawBindings, D, C, M>): VueProxy<PropsOptions, RawBindings, D, C, M>;

declare const Plugin: {
    install: (Vue: VueConstructor) => void;
};

declare const _refBrand: unique symbol;

interface Ref<T = any> {
    readonly [_refBrand]: true;
    value: T;
}

declare type ToRefs<T = any> = {
    [K in keyof T]: Ref<T[K]>;
};
declare type CollectionTypes = IterableCollections | WeakCollections;
declare type IterableCollections = Map<any, any> | Set<any>;
declare type WeakCollections = WeakMap<any, any> | WeakSet<any>;
declare type BaseTypes = string | number | boolean | Node | Window;
declare type ShallowUnwrapRef<T> = {
    [K in keyof T]: T[K] extends Ref<infer V> ? V : T[K];
};
declare type UnwrapRef<T> = T extends Ref<infer V> ? UnwrapRefSimple<V> : UnwrapRefSimple<T>;
declare type UnwrapRefSimple<T> = T extends Function | CollectionTypes | BaseTypes | Ref ? T : T extends Array<any> ? {
    [K in keyof T]: UnwrapRefSimple<T[K]>;
} : T extends object ? UnwrappedObject<T> : T;
declare type SymbolExtract<T> = (T extends {
    [Symbol.asyncIterator]: infer V;
} ? {
    [Symbol.asyncIterator]: V;
} : {}) & (T extends {
    [Symbol.hasInstance]: infer V;
} ? {
    [Symbol.hasInstance]: V;
} : {}) & (T extends {
    [Symbol.isConcatSpreadable]: infer V;
} ? {
    [Symbol.isConcatSpreadable]: V;
} : {}) & (T extends {
    [Symbol.iterator]: infer V;
} ? {
    [Symbol.iterator]: V;
} : {}) & (T extends {
    [Symbol.match]: infer V;
} ? {
    [Symbol.match]: V;
} : {}) & (T extends {
    [Symbol.replace]: infer V;
} ? {
    [Symbol.replace]: V;
} : {}) & (T extends {
    [Symbol.search]: infer V;
} ? {
    [Symbol.search]: V;
} : {}) & (T extends {
    [Symbol.species]: infer V;
} ? {
    [Symbol.species]: V;
} : {}) & (T extends {
    [Symbol.split]: infer V;
} ? {
    [Symbol.split]: V;
} : {}) & (T extends {
    [Symbol.toPrimitive]: infer V;
} ? {
    [Symbol.toPrimitive]: V;
} : {}) & (T extends {
    [Symbol.toStringTag]: infer V;
} ? {
    [Symbol.toStringTag]: V;
} : {}) & (T extends {
    [Symbol.unscopables]: infer V;
} ? {
    [Symbol.unscopables]: V;
} : {});
declare type UnwrappedObject<T> = {
    [P in keyof T]: UnwrapRef<T[P]>;
} & SymbolExtract<T>;

declare function ref<T extends object>(raw: T): T extends Ref ? T : Ref<UnwrapRef<T>>;
declare function ref<T>(raw: T): Ref<UnwrapRef<T>>;
declare function ref<T = any>(): Ref<T | undefined>;

declare function isRef<T>(value: any): value is Ref<T>;

declare function unref<T>(ref: T): T extends Ref<infer V> ? V : T;

declare function toRefs<T extends Data = Data>(obj: T): ToRefs<T>;

declare type CustomRefFactory<T> = (track: () => void, trigger: () => void) => {
    get: () => T;
    set: (value: T) => void;
};

declare function customRef<T>(factory: CustomRefFactory<T>): Ref<T>;

declare function toRef<T extends object, K extends keyof T>(object: T, key: K): Ref<T[K]>;

declare function shallowRef<T extends object>(value: T): T extends Ref ? T : Ref<T>;
declare function shallowRef<T>(value: T): Ref<T>;
declare function shallowRef<T = any>(): Ref<T | undefined>;

declare function triggerRef(value: any): void;

declare function proxyRefs<T extends object>(objectWithRefs: T): ShallowUnwrapRef<T>;

declare function isReadonly(obj: any): boolean;

declare function isReactive(obj: any): boolean;

declare function shallowReactive<T extends object = any>(obj: T): T;

declare function markReactive(target: any, shallow?: boolean): void;

/**
 * Make obj reactivity
 */
declare function reactive<T extends object>(obj: T): UnwrapRef<T>;

declare function shallowReadonly<T extends object>(obj: T): Readonly<T>;

/**
 * Make sure obj can't be a reactive
 */
declare function markRaw<T extends object>(obj: T): T;

declare function toRaw<T>(observed: T): T;

/**
 * Set a property on an object. Adds the new property, triggers change
 * notification and intercept it's subsequent access if the property doesn't
 * already exist.
 */
declare function set<T>(target: any, key: any, val: T): T;

declare const onBeforeMount: (callback: Function) => void;
declare const onMounted: (callback: Function) => void;
declare const onBeforeUpdate: (callback: Function) => void;
declare const onUpdated: (callback: Function) => void;
declare const onBeforeUnmount: (callback: Function) => void;
declare const onUnmounted: (callback: Function) => void;
declare const onErrorCaptured: (callback: Function) => void;
declare const onActivated: (callback: Function) => void;
declare const onDeactivated: (callback: Function) => void;
declare const onServerPrefetch: (callback: Function) => void;

interface Option<T> {
    get: () => T;
    set: (value: T) => void;
}

interface ComputedRef<T = any> extends WritableComputedRef<T> {
    readonly value: T;
}

interface WritableComputedRef<T> extends Ref<T> {
}

declare function computed<T>(getter: Option<T>['get']): ComputedRef<T>;
declare function computed<T>(options: Option<T>): WritableComputedRef<T>;

declare type WatchEffect = (onInvalidate: InvalidateCbRegistrator) => void;
declare type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T);
declare type WatchCallback<V = any, OV = any> = (value: V, oldValue: OV, onInvalidate: InvalidateCbRegistrator) => any;
declare type MapSources<T> = {
    [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
};
declare type MapOldSources<T, Immediate> = {
    [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
};

interface WatchOptionsBase {
    flush?: FlushMode;
}

declare type InvalidateCbRegistrator = (cb: () => void) => void;
declare type FlushMode = 'pre' | 'post' | 'sync';

interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
    immediate?: Immediate;
    deep?: boolean;
}

interface VueWatcher {
    lazy: boolean;

    get(): any;

    teardown(): void;

    run(): void;

    value: any;
}

declare type WatchStopHandle = () => void;

declare function watchEffect(effect: WatchEffect, options?: WatchOptionsBase): WatchStopHandle;

declare function watch<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchOptions<Immediate>): WatchStopHandle;
declare function watch<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate>): WatchStopHandle;
declare function watch<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate>): WatchStopHandle;

interface InjectionKey<T> extends Symbol {
}

declare function provide<T>(key: InjectionKey<T> | string, value: T): void;

declare function inject<T>(key: InjectionKey<T> | string): T | undefined;
declare function inject<T>(key: InjectionKey<T> | string, defaultValue: T, treatDefaultAsFactory?: boolean): T;

declare const useCSSModule: (name?: string) => Record<string, string>;

interface App {
    config: VueConstructor$1['config'];
    use: VueConstructor$1['use'];
    mixin: VueConstructor$1['mixin'];
    component: VueConstructor$1['component'];
    directive: VueConstructor$1['directive'];
    mount: Vue$1['$mount'];
    unmount: Vue$1['$destroy'];
}

declare function createApp(rootComponent: any, rootProps?: any): App;

declare type NextTick = Vue$1['$nextTick'];
declare const nextTick: NextTick;

declare const createElement: CreateElement;

declare function getCurrentInstance(): ComponentInstance | null;

declare const version: string;
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue$1> {
        setup?: SetupFunction<Data, Data>;
    }
}

export default Plugin;
export {
    ComponentRenderProxy,
    ComputedRef,
    FlushMode,
    InjectionKey,
    PropOptions,
    PropType,
    Ref,
    SetupContext,
    ShallowUnwrapRef,
    UnwrapRef,
    VueWatcher,
    WatchCallback,
    WatchEffect,
    WatchOptions,
    WatchOptionsBase,
    WatchSource,
    WatchStopHandle,
    WritableComputedRef,
    computed,
    createApp,
    customRef,
    defineComponent,
    getCurrentInstance,
    createElement as h,
    inject,
    isReactive,
    isReadonly,
    isRef,
    markRaw,
    markReactive,
    nextTick,
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onDeactivated,
    onErrorCaptured,
    onMounted,
    onServerPrefetch,
    onUnmounted,
    onUpdated,
    provide,
    proxyRefs,
    reactive,
    ref,
    set,
    shallowReactive,
    shallowReadonly,
    shallowRef,
    toRaw,
    toRef,
    toRefs,
    triggerRef,
    unref,
    useCSSModule,
    version,
    watch,
    watchEffect
};
