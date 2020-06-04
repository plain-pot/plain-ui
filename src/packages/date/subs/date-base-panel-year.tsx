import {computed, defineComponent} from "@vue/composition-api";
import {DatePublicProps, DefaultFormatString} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useDate} from "@/packages/date/useDate";

export default defineComponent({
    name: 'pl-date-base-panel-year',
    props: {
        ...DatePublicProps,
        displayFormat: {type: String, default: DefaultFormatString.year},
        valueFormat: {type: String, default: DefaultFormatString.year},
    },
    setup(props) {

        const {emit} = useEvent({
            input: EmitFunc,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,
            mousedownPanel: EmitFunc,
        })

        const {firstDatePanel} = useDate({props})

        /*---------------------------------------computer-------------------------------------------*/

        const targetPanelItemParam = computed(() => {
            if(firstDatePanel.value!=null){

            }
        })

    },
})