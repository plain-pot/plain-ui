import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {DEFAULT_STATUS, STATUS} from "../../utils/constant";
import {computed} from 'vue';
import './alert.scss'

export default designComponent({
    name: 'pl-alert',
    props: {
        ...StyleProps,

        title: {type: String},
        message: {type: String},
        icon: {type: String},
    },
    setup({props}) {

        const {slots} = useSlots(['title'], true)
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const icon = computed(() => {
            if (props.icon === null) {
                return null
            }
            return props.icon || STATUS[styleComputed.value.status!].icon
        })
        const classes = computed(() => [
            'pl-alert',
            `pl-alert-status-${styleComputed.value.status}`,
            `pl-alert-shape-${styleComputed.value.shape}`,
            {
                'pl-alert-has-icon': !!icon.value,
                'pl-alert-has-title': !!props.title || slots.title.isExist(),
            }
        ])

        return {
            render: () => (
                <div class={classes.value}>
                    {(!!props.title || slots.title.isExist()) && (
                        <div class={'pl-alert-title'}>
                            {slots.title(props.title)}
                        </div>
                    )}
                    {(!!props.message || slots.default.isExist()) && (
                        <div class={'pl-alert-message'}>
                            {slots.default(props.message)}
                        </div>
                    )}
                    <div class="pl-alert-icon">
                        <pl-icon icon={icon.value}/>
                    </div>
                </div>
            )
        }

    },
})