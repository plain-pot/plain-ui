import {PlcType} from "@/packages/table/plc/plc";

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

interface PlcTypeConstructor {
    new(): PlcType;
}

/*class PlcClazz implements PlcTypeConstructor {
    constructor() {}
}*/

// const c = new PlcClazz()

function log(fn: PlcTypeConstructor) {
    const a = new fn()
    console.log(a.scopedSlots)
}





