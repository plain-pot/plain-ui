import {PlainLoading} from 'plain-loading/src/index'
import {designComponent} from "../../use/designComponent";
import {useRefs} from "../../use/useRefs";
import {computed, nextTick, watch} from 'vue';
import './loading.scss'

export default designComponent({
    name: 'pl-loading',
    props: {
        type: {type: String, default: 'alpha'},
        status: {type: String, default: null},
    },
    setup({props}) {

        const {refs} = useRefs({
            el: HTMLElement,
        })

        const classes = computed(() => [
            'pl-loading',
            !!props.status ? `pl-loading-status-${props.status}` : null,
        ])

        watch(() => props.type, async val => {
            if (!val) {
                return refs.el.innerHTML = ''
            }
            await nextTick()
            if (!(PlainLoading as any)[val]) {
                throw new Error(`pl-loading: un recognise type:${val}`)
            }
            refs.el.innerHTML = (PlainLoading as any)[val]().outerHTML
        }, {immediate: true})

        return {
            render: () => {
                return <i class={classes.value} ref="el"/>
            }
        }
    },
})