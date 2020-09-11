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
} ? boolean : T extends FunctionConstructor | { type: FunctionConstructor } ? Function : T extends Prop<infer V> ? ExtractCorrectPropType<V> : T;
declare type ExtractPropTypes<O, MakeDefaultRequired extends boolean = true> = O extends object ? {
    [K in RequiredKeys<O, MakeDefaultRequired>]: InferPropType<O[K]>;
} & {
    [K in OptionalKeys<O, MakeDefaultRequired>]?: InferPropType<O[K]>;
} : {
    [K in string]: any;
};