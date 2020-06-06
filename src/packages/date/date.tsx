import {computed, defineComponent} from "@vue/composition-api";
import {EditProps} from "@/use/useEdit";
import {DatePublicProps} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {PlainDate} from "@/util/PlainDate";

export default defineComponent({
    name: 'pl-date',
    props: {
        ...EditProps,
        ...DatePublicProps,
    },
    setup(props) {

        const {emit} = useEvent({
            input: EmitFunc,
            blur: EmitFunc,
            focus: EmitFunc,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,
        })

        const value = useModel(() => props.value, emit.input)
        const start = useModel(() => props.start, emit.updateStart)
        const end = useModel(() => props.end, emit.updateEnd)

        const formatData = computed(() => ({
            value: new PlainDate(value.value, props.displayFormat!, props.valueFormat!),
            start: new PlainDate(start.value, props.displayFormat!, props.valueFormat!),
            end: new PlainDate(end.value, props.displayFormat!, props.valueFormat!),
        }))

        return () => (
            <div>
                
            </div>
        )
    },
})