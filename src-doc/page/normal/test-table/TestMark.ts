import {TestNode} from "./TestNode";
import {reactive, set} from "@vue/composition-api";
import {KeyGenerator} from "./KeyGenerator";
import {createFlagManager} from "@/util/NodeWrapper";

const generator = new KeyGenerator('test_node')

export class TestMark {

    selfGetter = () => this;

    node = {
        state: reactive({
            map: {} as { [k: string]: TestNode }
        }),
        get: (data: any): TestNode => {
            const key = generator.get(data)
            let node = this.node.state.map[key]
            if (!!node) {
                node.data = data
            } else {
                node = new TestNode(key, data, this.selfGetter)
                set(this.node.state.map, key, node)
            }
            return node
        },
        getList: (list: any[] | undefined): TestNode[] => {
            if (!list) return []
            return list.map(item => this.node.get(item))
        }
    }

    check = createFlagManager()

}