declare type Prop<T, Required extends boolean> = PropOptions<T, Required> | PropType<T>;

interface PropOptions<T = any, Required extends boolean = false> {
    type?: PropType<T> | null;
    required?: Required;
    default?: T | null | undefined | (() => T | null | undefined);

    validator?(value: any): boolean;
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
declare type InferPropType<T> = T extends null ? any : T extends {
    type: null;
} ? any : T extends ObjectConstructor | {
    type: ObjectConstructor;
} ? {
    [key: string]: any;
} : T extends Prop<infer V, true | false> ? V : T;
export declare type PlainExtractPropTypes<O, MakeDefaultRequired extends boolean = true> = {
    [K in RequiredKeys<O, MakeDefaultRequired>]: InferPropType<O[K]>;
} & {
    [K in OptionalKeys<O, MakeDefaultRequired>]?: InferPropType<O[K]>;
};
