import {computed, defineComponent} from "@vue/composition-api";

export default defineComponent({
    name: 'pl-icon',
    props: {
        icon: {type: String, require: true},
        status: {type: String},
        fontName: {type: String},
    },
    setup(props, context) {

        function onClick(e) {
            context.emit('click', e)
        }

        const classes = computed(() => ([
            'pl-icon',
            props.icon,
            {
                [`pl-icon-status-${props.status}`]: !!props.status,
                [props.fontName!]: !!props.fontName,
            }
        ]))

        const binding = computed(() => ({
            class: classes.value,
            on: {
                click: onClick,
            }
        }))

        return () => {
            if (!props.icon) {
                // console.warn('pl-icon: icon is require!')
                return null
            }
            if (props.icon!.indexOf('el-') === 0 || !!props.fontName) {
                return <i {...binding.value}/>
            }
            return (
                <svg aria-hidden="true" {...binding.value}>
                    <use {...{attrs: {'xlink:href': `#${props.icon}`}}}/>
                </svg>
            )
        }
    },
})