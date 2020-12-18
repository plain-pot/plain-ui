import {designComponent} from "../../../../use/designComponent";
import {PlcProps} from "./plc.utils";
import {TablePlcCollector} from './plc-collector';
import {Plc} from "./plc.type";
import {useNumber} from "../../../../use/useNumber";
import {computed, reactive} from 'vue';

export default designComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup({props}) {
        /*collector收集列信息*/
        TablePlcCollector.useChild()
        /*格式化props*/
        const {numberState} = useNumber(props, ['order', 'width'])
        /*目标props*/
        const formatProps = computed(() => ({
            ...props,
            numberState,
        }) as Omit<typeof props, 'order' | 'width'> & typeof numberState)
        /*props的一个副本，不过如果有值的情况下，优先级比props中的值高（比config值也高）*/
        const propsState = reactive(Object.keys(PlcProps).reduce((ret: any, key: string) => {
            ret[key] = null
            return ret
        }, {}) as { [k in keyof typeof formatProps.value]: typeof formatProps.value[k] | null })

        const plc: Plc = reactive({
            group: false,
            props: formatProps,
            state: propsState,
            refer: () => plc,
        })

        return {
            refer: plc,
            render: () => (
                <div>
                    plc-{props.title}-{props.field}
                </div>
            )
        }
    },
})