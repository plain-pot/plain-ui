import {computed, defineComponent} from "@vue/composition-api";

const iconfont = {} as { [k: string]: string }

function registry(prefix: string, fontFamily: string) {
    iconfont[prefix] = fontFamily
}

export default defineComponent({
    name: 'pl-icon',
    // @ts-ignore
    registry,
    props: {
        icon: {type: String, require: true},
        status: {type: String},
    },
    setup(props, context) {

        function onClick(e) {
            context.emit('click', e)
        }

        const prefix = computed(() => {
            if (!props.icon) {
                return null
            }
            return props.icon.slice(0, props.icon.indexOf('-'))
        })

        const isSvg = computed(() => {
            if (!prefix.value) {
                return false
            }
            return !iconfont[prefix.value];
        })

        const classes = computed(() => ([
            'pl-icon',
            props.icon,
            {
                [`pl-icon-status-${props.status}`]: !!props.status,
                [iconfont[prefix.value!]]: !isSvg.value && prefix.value !== 'el',
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
            if (isSvg.value) {
                return (
                    <svg aria-hidden="true" {...binding.value}>
                        <use {...{attrs: {'xlink:href': `#${props.icon}`}}}/>
                    </svg>
                )
            }
            return <i {...binding.value}/>
        }
    },
})