import {designComponent} from "../../use/designComponent";
import {markRaw, PropType, reactive, watch, nextTick, onBeforeUnmount} from 'vue';
import {Page} from "./NavigatorManager";
import Nav from './nav'
import {useRefs} from "../../use/useRefs";
import {SimpleFunction} from "../../shims";

export const NavPage = designComponent({
    name: 'pl-nav-page',
    props: {
        page: {type: Object as PropType<Page>, required: true},
        isLast: {type: Boolean, required: true},
    },
    setup({props}) {

        const {refs} = useRefs({
            el: HTMLDivElement
        })

        const parent = Nav.use.inject()

        const state = reactive({
            PageComponent: null as any,
            renderEl: false,
        });

        let unmountHandler: null | SimpleFunction = null;

        (async () => {
            const loader = await parent.props.nav.utils.getAppLoader(props.page.pageConfig)
            if (!!loader) {
                if ('getPage' in loader) {
                    const Component = await loader.getPage(props.page.pageConfig)
                    state.PageComponent = markRaw(Component)
                } else {
                    state.renderEl = true
                    await nextTick()
                    const mountData = await loader.mount(refs.el!, props.page.pageConfig)
                    unmountHandler = () => loader.unmount(mountData)
                }
            }
        })();

        onBeforeUnmount(() => {
            !!unmountHandler && unmountHandler()
        })

        return {
            render: () => {
                const {PageComponent} = state
                return (
                    <div class="pl-nav-page" v-show={props.isLast}>
                        {state.renderEl && <div ref="el"/>}
                        {PageComponent && <PageComponent/>}
                    </div>
                )
            }
        }
    },
})