import {computed, defineComponent, inject, onMounted, provide, reactive} from "@vue/composition-api";
import {TableProps, TablePropsType} from "@/packages/table/table-utils";
import {useSlots} from "@/use/useSlots";
import {FormatPropsType, useProps} from "@/use/useProps";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {handlePlcConfigAndState} from "@/packages/table/plc/plc-utils";
import {CompRef, useRefs} from "@/use/useRefs";
import {printPlcData} from "@/packages/table/plc/debug";
import {PlainTable} from "@/packages/table/table-bak/table";
import './table.scss'

const PLAIN_TABLE_PROVIDER = '@@PLAIN_TABLE_PROVIDER'
export const injectTable = () => inject(PLAIN_TABLE_PROVIDER) as PlainTable

function tableSetup(props: TablePropsType) {

    /*---------------------------------------slots-------------------------------------------*/
    const {slots} = useSlots()
    /*---------------------------------------refs-------------------------------------------*/
    const refs = useRefs({collector: CompRef,})

    /*---------------------------------------state-------------------------------------------*/
    const state = reactive({
        tableWidth: null as null | number,

    })
    const propsState = useProps(props, {
        headRowHeight: FormatPropsType.number,
        bodyRowHeight: FormatPropsType.number,
    })

    /*---------------------------------------computed-------------------------------------------*/
    const plcData = computed(() => {
        if (!state.tableWidth) return null
        // plc: props = props + propsState
        let items = refs.collector.items.value as (PlcType | PlcGroupType)[]
        // table: config plc, and  combine: props + config + state
        const ret = handlePlcConfigAndState(items, props.config, state.tableWidth)

        const has = computed(() => ({
            hasFixedLeft: ret.hasFixedLeft,
            hasFixedRight: ret.hasFixedRight,
        }))

        return {...ret, has}
    });

    /*---------------------------------------refer-------------------------------------------*/
    const refer = {
        props,
        slots,
        state,
        propsState,
        plcData,
    }

    /*---------------------------------------provider-------------------------------------------*/
    provide(PLAIN_TABLE_PROVIDER, refer)

    /*---------------------------------------lifecycle-------------------------------------------*/
    onMounted(() => {
        state.tableWidth = refs.$el.offsetWidth
    })


    return refer
}

export default defineComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup(props) {

        const {
            slots,
            state,
            plcData,
        } = tableSetup(props)

        return () => (
            <div class="pl-table">
                <plc-collector ref="collector">
                    {slots.default()}
                </plc-collector>
                {!!state.tableWidth && [
                    <plt-head ref="head"/>,
                    <plt-body ref="body"/>,
                ]}
                {!!props.debugPlc && state.tableWidth && printPlcData(plcData.value!.plcList)}
            </div>
        )
    },
})