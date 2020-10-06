declare type PlainExtractPropTypes<O, MakeDefaultRequired extends boolean = true> = {
    [K in RequiredKeys<O, MakeDefaultRequired>]: InferPropType<O[K]>;
} & {
    [K in OptionalKeys<O, MakeDefaultRequired>]?: InferPropType<O[K]>;
};