export enum FormatPropsType {
    promise = 'promise',
    function = 'function',
    number = 'number',
}

export function useProps<PropsType extends object, PropsKey extends keyof PropsType, OptionType extends { [key in PropsKey]?: FormatPropsType }>
(props: PropsType, option: OptionType): undefined | { [key in keyof OptionType]: PropsType[PropsKey] } {
    return undefined
}