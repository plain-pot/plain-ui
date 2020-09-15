import {TestNode} from "./TestNode";
import {reactive, set} from "@vue/composition-api";
import {KeyGenerator} from "./KeyGenerator";

const generator = new KeyGenerator('test_node')

export class TestMark {

    node = {
        map: {} as { [k: string]: TestNode },
        get: (data: any): TestNode => {
            const key = generator.get(data)
            let node = this.node.map[key]
            if (!!node) {
                node.data = data
            } else {
                node = new TestNode(key, data, this)
                set(this.node.map, key, node)
            }

            return node
        },
        getList: (list: any[] | undefined): TestNode[] => {
            if (!list) return []
            return list.map(item => this.node.get(item))
        }
    }

    check = {
        map: reactive({}) as { [k: string]: boolean },
        set: (key: string, val: boolean) => {
            if (this.check.map.hasOwnProperty(key)) {
                console.log('hasOwnProperty')
                this.check.map[key] = val
            } else {
                console.log('not hasOwnProperty')
                set(this.check.map, key, val)
            }
        },
        get: (key: string): boolean => {
            return this.check.map[key]
        }
    }

}