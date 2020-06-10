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

            let durX = state.endX - state.startX!

            plc.value.state.width = (plc.value.state.width || plc.value.props.width) as number + durX
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
            const height = `${table.props.headRowHeight}px`
            const width = `${(props.plc as PlcType).props.width}px`
            return {
                height,
                width,
            }
        })

        const {
            handler
        } = useResize(table.refs.$el, plc)

        return () => {
            if (props.fixed !== PlcFixedType.center && plc.value.props.fixed !== props.fixed) return null

            const {colspan, rowspan, props: {title}} = plc.value

            const binding = {
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