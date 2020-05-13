export enum FormatPropsType {
    promise = 'promise',
    function = 'function',
    number = 'number',
}

class People {
    sayHello() {}
}

// @ts-ignore
export function useProps<T extends object, O = { [key in keyof T]?: FormatPropsType }, K = keyof O>(props: T, option: O): { [key in keyof O]: T[key] } {
    // @ts-ignore
    return undefined
}

const props = {
    name: 'hello world',
    age: 20,
    gender: true,
    people: new People(),
}

const newProps = useProps(props, {
    name: FormatPropsType.number,
    gender: FormatPropsType.function,
    people: FormatPropsType.promise,
})

newProps.people.sayHello()


// newProps.name 是字符串
// newProps.gender 是布尔值
// newProps 没有age属性

