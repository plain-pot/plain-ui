import {computed, defineComponent, Ref} from "@vue/composition-api";
import {useCollectParent} from "@/use/useCollect";
import {PLC_COLLECTOR, PlcComponentType} from "@/packages/table/plc/plc-utils";
import {useSlots} from "@/use/useSlots";
import {useRefer} from "@/use/useRefer";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";

function formatItems(items: Ref<(PlcType | PlcGroupType)[]>): (PlcType | PlcGroupType)[] {

    const ret: (PlcType | PlcGroupType)[] = []

    items.value.forEach(item => {
        let refer;
        switch (item.type) {
            case PlcComponentType.PLC:
                refer = (item as any).refer
                ret.push({
                    ...refer,
                    props: refer.props.value,
                })
                break
            case PlcComponentType.GROUP:
                refer = (item as any).refer
                const newRefer = {
                    ...refer,
                    props: refer.props.value,
                    items: {value: formatItems(refer.items) as PlcGroupType[]}
                }
                ret.push(newRefer)
                break
            default:
                throw new Error(`can't recognise plc type:${item.type}`)
        }
    })

    return ret

}

export default defineComponent({
    name: 'plc-collector',
    setup() {
        const items = useCollectParent({sort: true, provideString: PLC_COLLECTOR}) as Ref<(PlcType | PlcGroupType)[]>

        const {slots} = useSlots()

        const refer = {
            items: computed(() => formatItems(items)),
        }

        useRefer(refer)

        return () => (
            <div class="plc-collector">
                {slots.default()}
            </div>
        )
    },
})