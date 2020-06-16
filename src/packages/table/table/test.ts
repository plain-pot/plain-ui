type TableNode = {
    name: string
    age: number
}

let a: TableNode

function props<O, T extends { new(...args: any[]): O }>(clazz: T): O {
    return {} as O
}

const propsVal = props(Boolean)

/*function test<T>(
    data: T,
    option: {
        beforeLoad: (config: { url: string, param: T & { page: number, size: number } }) => void
    }
) {

}

test({
    accid: 'ssss',
}, {
    beforeLoad: ({param}) => {

    }
})*/

class Test<T> {
    constructor(option: {
        param: T,
        beforeLoad: (option: { url: string, param: T & { page: number } }) => void
    }) {}
}

const t = new Test({
    param: {
        haha: true,
    },
    beforeLoad: ({param}) => {
        console.log(param.haha)
    }
})
