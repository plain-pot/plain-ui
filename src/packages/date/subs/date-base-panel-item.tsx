import {computed, defineComponent} from "@vue/composition-api";
import {DateBasePanelItemData} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";

export default defineComponent({
    name: 'pl-date-base-panel-item',
    props: {
        item: {type: DateBasePanelItemData, default: () => new DateBasePanelItemData()},
        component: {default: 'li'},
        componentProps: {type: Object},
        nativeListener: {type: Boolean},
    },
    setup(props) {

        const {emit} = useEvent({
            click: EmitFunc,
            mouseenter: EmitFunc,
        })

        const classes = computed(() => [
            'pl-date-base-panel-item',
            {
                'pl-date-base-panel-item-active': props.item.active,
                'pl-date-base-panel-item-now': props.item.now,
                'pl-date-base-panel-item-disabled': props.item.disabled,
                'pl-date-base-panel-item-hover-start': props.item.hoverStart,
                'pl-date-base-panel-item-hover': props.item.hover,
                'pl-date-base-panel-item-hover-end': props.item.hoverEnd,
            }
        ])

        const listener = computed(() => {
            if (props.item.disabled) {
                return {}
            }
            return {
                [props.nativeListener ? 'nativeOn' : 'on']: {
                    click: () => {
                        emit.click(props.item)
                    },
                    ...(props.item.range ? {
                        mouseenter: () => {
                            emit.mouseenter(props.item)
                        },
                    } : {})
                },
            }
        })

        return () => {
            const Component = props.component
            return (
                <Component class={classes.value} {...{props: props.componentProps, ...listener.value}}>
                    <div><span>{props.item.label}</span></div>
                </Component>
            )
        }
    },
})