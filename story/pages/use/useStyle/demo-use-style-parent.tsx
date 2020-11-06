import {designComponent} from "../../../../src/use/designComponent";
import {StyleProps, StyleStatus, useStyle} from "../../../../src/use/useStyle";
import {computed} from 'vue';
import {useSlots} from "../../../../src/use/useSlots";
import {DEFAULT_STATUS} from "../../../../src/utils/constant";

export const DemoUseStyleParent = designComponent({
    props: {
        ...StyleProps,
    },
    setup() {

        const {slots} = useSlots()
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const classes = computed(() => [
            'pl-use-style-parent',
            `pl-use-style-parent-status-${styleComputed.value.status}`
        ])

        return {
            render: () => (
                <div class={classes.value}>
                    <div>PARENT</div>
                    <div>
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})