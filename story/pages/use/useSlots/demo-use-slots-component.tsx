import {designComponent} from "../../../../src/use/designComponent";
import {useSlots} from "../../../../src/use/useSlots";
import {computed, watch} from 'vue';

export const DemoUseSlotsComponent = designComponent({
    name: 'demo-use-slots-component',
    props: {},
    setup() {

        const {slots} = useSlots([
            'head',
            'foot'
        ])

        const classes = computed(() => [
            'demo-use-slots-component',
            {
                'demo-use-slots-component-has-slot-head': slots.head.isExist()
            }
        ])

        watch(() => slots.head.isExist(), () => {
            console.log('head change')
        })
        watch(() => slots.foot.isExist(), () => {
            console.log('foot change')
        })

        return {
            render() {
                return (
                    <div class={classes.value}>
                        <div class="demo-use-slots-component-head">
                            {slots.head('default head')}
                        </div>
                        <div class="demo-use-slots-component-body">
                            {slots.default(
                                <h1>default body</h1>
                            )}
                        </div>
                        <div class="demo-use-slots-component-foot">
                            {slots.foot('default foot')}
                        </div>
                    </div>
                )
            },
        }
    },
})