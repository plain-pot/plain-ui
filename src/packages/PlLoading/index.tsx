import {designComponent, useRefs, watch} from "plain-ui-composition";
import {PlainLoading} from "plain-loading";
import {delay} from "plain-utils/utils/delay";

import {useClasses} from "plain-ui-composition";
import './loading.scss'
import {InheritHtmlElement} from "plain-ui-composition";

export const PlLoading = designComponent({
    name: 'pl-loading',
    props: {
        type: {type: String, default: 'alpha'},
        status: {type: String, default: null},
    },
    inheritPropsType: InheritHtmlElement,
    setup({props}) {

        const {refs, onRef} = useRefs({el: HTMLElement})

        const classes = useClasses(() => [
            'pl-loading',
            !!props.status ? `pl-loading-status-${props.status}` : null,
        ])

        watch(() => props.type, async val => {
            if (!val) {
                return !!refs.el && (refs.el.innerHTML = '')
            }
            await delay(23)
            if (!(PlainLoading as any)[val]) {
                throw new Error(`pl-loading: un recognise type:${val}`)
            }
            !!refs.el && (refs.el!.innerHTML = (PlainLoading as any)[val]().outerHTML)
        }, {immediate: true})

        return {
            refer: {
                refs,
            },
            render: () => {
                return <i class={classes.value} ref={onRef.el}/>
            }
        }
    },
})

export default PlLoading
