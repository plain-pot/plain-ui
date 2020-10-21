interface Test {
    name: string,
    age: number
}

export const test = (name: string, age: number) => {
    console.log('test')
}

export default {
    test,
    name: 'blob',
    hello: (test: Test) => {
        console.log('hello', test)
    }
}