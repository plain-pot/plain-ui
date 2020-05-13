export enum FormatPropsType {
    promise = 'promise',
    function = 'function',
    number = 'number',
}

export function useProps<T, O>(props: T, option: O extends { [key in keyof T]?: FormatPropsType }): any {
    // @ts-ignore
    return undefined
}


const props = {
    name: 'hello world',
    age: 20,
    gender: true,
}

const newProps = useProps(props, {

})

