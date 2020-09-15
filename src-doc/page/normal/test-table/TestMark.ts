import {TestNode} from "./TestNode";
import {set} from "@vue/composition-api";
import {KeyGenerator} from "./KeyGenerator";

const generator = new KeyGenerator('test_node')

export class TestMark {

    nodeMap = {} as { [k: string]: TestNode }

    format(data: any): TestNode {
        const key = generator.get(data)
        let node = this.nodeMap[key]
        if (!!node) {
            node.data = data
        } else {
            node = new TestNode(key, data)
            set(this.nodeMap, key, node)
        }

        return node
    }

    formatList(list: any[] | undefined): TestNode[] {
        if (!list) return []
        return list.map(item => this.format(item))
    }

}