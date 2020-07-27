import {computed, defineComponent} from "@vue/composition-api";
import {TreeProps, useTree} from "@/packages/tree/use/use-tree";
import {$plain} from "@/packages/base";
import {StyleType} from "@/types/utils";
import {TreeNode} from "@/packages/tree/utils/TreeNode";

export default defineComponent({
    name: 'pl-virtual-tree',
    props: {
        ...TreeProps,

        virtual: {type: Boolean},
        width: {type: [Number, String]},
        height: {type: [Number, String]},
    },
    setup(props) {

        const data = useTree(props)

        const styles = computed(() => {
            const styles = {} as StyleType
            if (!!props.width) styles.width = $plain.utils.suffixPx(props.width)!
            if (!!props.height) styles.height = $plain.utils.suffixPx(props.height)!
            return styles
        })

        const formatDataFlat = computed(() => {
            const formatData = data.formatData.value
            const formatDataFlat: TreeNode[] = []
            data.utils.iterateAll(formatData, (treeNode: TreeNode) => {
                formatDataFlat.push(treeNode)
            }, (treeNode: TreeNode) => {
                return treeNode.isExpand === true
            })
            return formatDataFlat.filter((treeNode: TreeNode) => !!treeNode.isVisible)
        })

        const utils = {
            disabledQueueAnimation: $plain.utils.debounce(() => data.state.virtualScrollFlag = false, 300, true)
        }
        const handler = {
            virtualScroll: () => {
                data.state.virtualScrollFlag = true
                utils.disabledQueueAnimation()
            }
        }

        return () => {

            const directives = [{name: 'loading', value: data.isLoading.value}]

            return (
                <div {...{directives}} class={data.classes.value} style={styles.value}>
                    {(!formatDataFlat.value || formatDataFlat.value.length === 0) && (
                        <div class="pl-tree-node-empty-text"
                             key="pl-tree-node-empty-text">
                            <pl-icon icon="el-icon-reading"/>
                            <span>{props.emptyText}</span>
                        </div>
                    )}
                    {!!props.draggable && <span class="pl-tree-drag-indicator" key="pl-tree-drag-indicator" {...{directives: [{name: 'show', value: data.dragState.state.show}]}} style={data.indicatorStyles.value}></span>}

                    {!!props.virtual ?
                        <pl-virtual-list data={formatDataFlat.value}
                                         size={24}
                                         contentIs="pl-list"
                                         contentProps={{direction: "right", disabled: data.state.virtualScrollFlag}}
                                         onScroll={handler.virtualScroll}
                                         {...{
                                             scopedSlots: {default: ({item, index}) => <pl-virtual-tree-node treeNode={item} key={item.key} vid={index}/>}
                                         }}/> :
                        <pl-list direction="right">
                            {formatDataFlat.value.map((item) => <pl-virtual-tree-node treeNode={item} key={item.key}/>)}
                        </pl-list>
                    }
                </div>
            )
        }
    },
})