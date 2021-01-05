import {designComponent} from "../../use/designComponent";
import {PropType, reactive, watch, markRaw} from 'vue';
import {GetPage, Page} from "./NavigatorManager";

export const NavPage = designComponent({
    name: 'pl-nav-page',
    props: {
        page: {type: Object as PropType<Page>, required: true},
        getPage: {type: Function as PropType<GetPage>, required: true},
        isLast: {type: Boolean, required: true},
    },
    setup({props}) {

        const state = reactive({
            PageComponent: null as any,
        })

        watch(() => props.page.pageConfig, async pageConfig => {
            const Component = await props.getPage(pageConfig)
            state.PageComponent = markRaw(Component)
        }, {
            immediate: true
        })

        return {
            render: () => {
                const {PageComponent} = state
                return (
                    <div class="pl-nav-page">
                        {PageComponent && <PageComponent/>}
                    </div>
                )
            }
        }
    },
})