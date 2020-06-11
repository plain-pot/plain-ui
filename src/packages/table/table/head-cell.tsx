import {computed, defineComponent, inject, reactive, Ref} from "@vue/composition-api";
import {getCellClass, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlcType} from "@/packages/table/plc/plc";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";
import {$plain} from "@/packages/base";

function useResize(table: HTMLElement, plc: Ref<PlcType>) {
    const state = reactive({
        indicatorEl: null as null | HTMLElement,
        startX: null as null | number,
        endX: null as null | number,
    })
    const handler = {
        mousedown: (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()

            window.addEventListener('mousemove', handler.mousemove)
            window.addEventListener('mouseup', handler.mouseup)
            $plain.disableSelect()
            state.startX = e.clientX

            state.indicatorEl = document.createElement('div')

            const cell = e.currentTarget as HTMLElement

            const {left, width} = cell.getBoundingClientRect()
            const {top, height} = table.getBoundingClientRect()

            Object.assign(state.indicatorEl.style, {
                display: 'inline-block',
                zIndex: 9999,
                position: 'fixed',

                width: `${width}px`,
                backgroundColor: '#ddd',
                height: `${height}px`,
                top: `${top}px`,
                left: `${left}px`,
            })

            document.body.appendChild(state.indicatorEl)
        },
        mousemove: (e: MouseEvent) => {
            state.indicatorEl!.style.left = `${e.clientX}px`
        },
        mouseup: (e: MouseEvent) => {
            window.removeEventListener('mousemove', handler.mousemove)
            window.removeEventListener('mouseup', handler.mouseup)
            $plain.enableSelect()
            document.body.removeChild(state.indicatorEl!)
            state.endX = e.clientX
            let durWidth = state.endX - state.startX!
            plc.value.setDurWidth(durWidth)
        }
    }

    return {
        state,
        handler,
    }
}

export default defineComponent({
    name: 'plt-head-cell',
    props: {
        fixed: {type: String, required: true},
        plc: {type: Object},
    },
    setup(props) {

        const table = inject(TABLE_PROVIDER) as PlainTable

        const plc = computed(() => {
            return props.plc as PlcType
        })

        const classes = computed(() => [
            'plt-head-cell',
            'plt-cell',
            ...getCellClass(props.plc as PlcType),
        ])

        const styles = computed(() => {
            const height = `${table.props.headRowHeight as number * plc.value.rowspan!}px`
            const width = `${(props.plc as PlcType).props.width}px`
            return {
                height,
                width,
            }
        })

        /**
         * 给 head-cell 加一个key，当 plc的props变化之后，head-cell节点会更新为新的节点，触发 scroll 的 ObjectServer事件，从而刷新滚动条宽度
         * @author  韦胜健
         * @date    2020/6/11 11:03
         */
        const key = computed(() => {
            const plc = props.plc as PlcType
            return Object.keys(plc.props).reduce((ret, key) => {
                ret += `_${key}=${plc.props[key] || ''}`
                return ret
            }, '')
        })

        const {
            handler
        } = useResize(table.refs.$el, plc)

        return () => {
            if (props.fixed !== PlcFixedType.center && plc.value.props.fixed !== props.fixed) return null

            const {colspan, rowspan, props: {title}} = plc.value

            const binding = {
                key: key.value,
                class: classes.value,
                style: styles.value,
                attrs: {
                    colspan,
                    rowspan,
                },
            }

            return (
                <th {...binding}>
                    {props.fixed === plc.value.props.fixed ? (
                        [
                            title,
                            <span class="plt-head-cell-indicator" onMousedown={handler.mousedown}/>,
                        ]
                    ) : null}
                </th>
            )
        }

    },
})