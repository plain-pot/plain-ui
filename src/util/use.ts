export enum FormatPropsType {
    promise = 'promise',
    function = 'function',
    number = 'number',
}

type OptionType<T> = {
    [key in keyof T]: FormatPropsType
}

export function useProps<T>(props: T, option: { [key in keyof T]?: FormatPropsType }): T {
    // @ts-ignore
    return undefined
}