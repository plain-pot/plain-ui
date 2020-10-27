import {designComponent} from "../../../../src/use/designComponent";
import {StyleProps, StyleStatus, useStyle} from "../../../../src/use/useStyle";
import {computed} from 'vue';

export const DemoUseStyleChild = designComponent({
    props: {
        ...StyleProps,
    },
    setup() {

        const {styleComputed} = useStyle({status: StyleStatus.primary})
        const classes = computed(() => [
            'pl-use-style-child',
            `pl-use-style-child-status-${styleComputed.value.status}`
        ])

        return {
            render: () => (
                <div class={classes.value}>
                    CHILD
                </div>
            )
        }
    },
})