import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import Scroll from '../scroll'
import {computed, PropType} from 'vue';
import {SimpleObject} from "../../shims";
import {useScopedSlots} from "../../use/useScopedSlots";

export const VirtualTable = designComponent({
    name: 'pl-virtual-table',
    props: {
        data: {type: Array as PropType<SimpleObject[]>, require: true, default: []},// 要渲染的长数据
        size: {type: Number, require: true, default: 40},           // 每一行高度
        dynamicSize: {type: Boolean},                               // 标识列表中的每一行高度不是固定的，但是还是需要提供 size 属性，而且size属性不能与每一行的高度差距太多；
        disabled: {type: Boolean},                                  // 禁用虚拟滚动

        summaryData: {type: Array as PropType<SimpleObject[]>},     // 合计行数据
        width: {type: Number},                                      // 宽度
        height: {type: Number},                                     // 高度
    },
    setup({props}) {

        const {slots} = useSlots(['colgroup'])
        const {scopedSlots} = useScopedSlots({default: {item: Object, index: Number}})
        const {refs} = useRefs({scroll: Scroll,})

        /*---------------------------------------state-------------------------------------------*/

        const freeState = {
            scrollLeft: 0,
        }

        /*---------------------------------------computed-------------------------------------------*/

        const styles = computed(() => ({
            height: `${props.height}px`
        }))

        const tableStyles = computed(() => ({
            width: `${props.width}px`,
        }))

        const summaryTableStyles = computed(() => {
            return {
                ...tableStyles.value,
                height: `${!props.summaryData ? 0 : props.summaryData.length * props.size}px`
            }
        })

        const strutStyles = computed(() => {
            if (props.disabled) return null
            const dataHeight = (props.data || []).length * props.size
            const summaryHeight = (!!props.summaryData && props.summaryData.length > 0) ? (props.summaryData.length * props.size) : 0
            return {
                height: `${dataHeight + summaryHeight + 6}px`
            }
        })

        const classes = computed(() => [
            'pl-virtual-list',
            {
                'pl-virtual-list-disabled': props.disabled,
            }
        ])

        const handler = {
            onScroll: (e: Event) => {
                // todo
            },
        }

        return {
            render: () => {
                return (
                    <div class={classes.value} style={styles.value}>
                        <Scroll
                            ref="scroll"
                            disableListTransition
                            onScroll={handler.onScroll}
                            scrollX
                        >
                            <div class="pl-virtual-list-strut">
                                <div class="pl-virtual-list-content">
                                    <table {...{cellpadding: 0, cellspacing: 0, border: 0, style: tableStyles.value}}>
                                        {slots.colgroup()}
                                        {props.data.map((item, index) => scopedSlots.default({item, index}))}
                                    </table>
                                </div>
                            </div>
                        </Scroll>
                    </div>
                )
            }
        }
    },
})