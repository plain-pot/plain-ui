import {designComponent} from "../../../../src/use/designComponent";
import {useScopedSlots} from "../../../../src/use/useScopedSlots";
import {computed} from 'vue';

class TreeNode {
    isExpand = false
    isChecked = false

    constructor(
        public data: any,
    ) {}
}

export const DemoTreeForScopedSlots = designComponent({
    props: {
        data: {type: Array},
    },
    setup({props}) {

        const {scopedSlots} = useScopedSlots({
            default: {node: TreeNode, index: Number},
        }, true)

        const formatData = computed(() => (props.data || []).map(item => new TreeNode(item)))

        const classes = computed(() => [
            'demo-use-scoped-slots-components',
            {
                'demo-use-scoped-slots-components-has-default': scopedSlots.default.isExist()
            }
        ])

        return {
            render() {
                return (
                    <div class={classes.value}>
                        <h1>标题</h1>
                        <ul>
                            {formatData.value.map((node, index) => (
                                <li key={index}>
                                    {scopedSlots.default(
                                        {node, index},
                                        (<button>{JSON.stringify(node.data)}</button>)
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            },
        }
    },
})