import {designComponent} from "../../use/designComponent";
import {markRaw, PropType, reactive, watch} from 'vue';
import {Page} from "./NavigatorManager";
import Nav from './nav'

export const NavPage = designComponent({
    name: 'pl-nav-page',
    props: {
        page: {type: Object as PropType<Page>, required: true},
        isLast: {type: Boolean, required: true},
    },
    setup({props}) {

        const parent = Nav.use.inject()

        const state = reactive({
            PageComponent: null as any,
        })

        watch(() => props.page.pageConfig, async pageConfig => {
            const Component = await parent.props.nav.utils.getPage(pageConfig)
            state.PageComponent = markRaw(Component)
        }, {
            immediate: true
        })

        return {
            render: () => {
                const {PageComponent} = state
                return (
                    <div class="pl-nav-page" v-show={props.isLast}>
                        {PageComponent && <PageComponent/>}
                    </div>
                )
            }
        }
    },
})