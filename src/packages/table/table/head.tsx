import {defineComponent, inject} from "@vue/composition-api";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";
import {CompRef, useRefs} from "@/use/useRefs";
import {PlainScroll} from "@/packages/scroll/scroll";

export default defineComponent({
    name: 'plt-head',
    setup() {

        const refs = useRefs({
            scroll: {} as PlainScroll,
        })
        const table = inject(TABLE_PROVIDER) as PlainTable
        console.log(table.plcData.value!.plcList)
        return () => (
            <div>
                table head
            </div>
        )
    },
})