import {computed, defineComponent} from "@vue/composition-api";

export default defineComponent({
    name: 'pl-icon',
    props: {
        icon: {type: String, require: true},
        status: {type: String},
        svg: {type: Boolean, default: true},
    },
    setup(props, context) {

        function onClick(e) {
            context.emit('click', e)
        }

        const classes = computed(() => ([
            'pl-icon',
            props.icon,
            {
                [`pl-icon-status-${props.status}`]: !!props.status
            }
        ]))

        const binding = {
            class: classes.value,
            on: {
                click: onClick,
            }
        }

        return () => {
            if (props.icon!.indexOf('el-') === 0 || !props.svg) {
                return <i {...binding}/>
            }
            if (props.svg) {
                return (
                    <svg aria-hidden="true" {...binding}>
                        <use {...{attrs: {'xlink:href': `#${props.icon}`}}}/>
                    </svg>
                )
            }
        }
    },
})