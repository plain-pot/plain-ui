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
        state: reactive({
            map: {} as { [k: string]: boolean },
        }),
        set: (key: string, val: boolean) => {
            if (this.check.state.map.hasOwnProperty(key)) {
                this.check.state.map[key] = val
            } else {
                set(this.check.state.map, key, val)
            }
        },
        get: (key: string): boolean => {
            return this.check.state.map[key]
        }
    }

}