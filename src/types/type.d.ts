declare type PlainExtractPropTypes<O, MakeDefaultRequired extends boolean = true> = {
    [K in RequiredKeys<O, MakeDefaultRequired>]: InferPropType<O[K]>;
} & {
    [K in OptionalKeys<O, MakeDefaultRequired>]?: InferPropType<O[K]>;
};

declare type Equal<Left, Right> = (<U>() => U extends Left ? 1 : 0) extends (<U>() => U extends Right ? 1 : 0) ? true : false;
declare type HasDefined<T> = Equal<T, unknown> extends true ? false : true;