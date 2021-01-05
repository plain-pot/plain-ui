import {designComponent} from "../../use/designComponent";
import {PropType, provide, inject} from 'vue';
import {NavigatorManager, PageConfig, Stack} from "./NavigatorManager";
import {NavPage} from "./nav-page";
import Nav from "./nav";

export const PROVIDE_NAV_CONSTANT = '@@PROVIDE_NAV_CONSTANT'

function provideNavPage({nav, stack}: { nav: NavigatorManager, stack: Stack }) {
    const $nav = {
        /*---------------------------------------tab methods-------------------------------------------*/
        ...nav.tabMethods,
        /*---------------------------------------path methods-------------------------------------------*/
        /*push一个页面*/
        push: (pageConfig: PageConfig) => {
            return nav.pageMethods.push(stack, pageConfig)
        },
        /*pop一个页面*/
        back: () => {
            return nav.pageMethods.back(stack)
        },
        /*重定向到一个页面*/
        redirect: () => {/*todo*/},
        /*刷新页面*/
        refresh: () => {/*todo*/},
        /*开启/关闭页面的加载状态*/
        loading: () => {/*todo*/},
        /*获取当前页面信息*/
        getCurrentPage: () => {/*todo*/},
        /*监听事件*/
        on: () => {/*todo*/},
        /*解除监听事件*/
        off: () => {/*todo*/},
        /*监听一次事件*/
        once: () => {/*todo*/},
        /*派发事件*/
        emit: () => {/*todo*/},
    }
    provide(PROVIDE_NAV_CONSTANT, $nav)
    return $nav
}

export function useNav() {
    return inject(PROVIDE_NAV_CONSTANT) as ReturnType<typeof provideNavPage>
}

export const NavStack = designComponent({
    name: "pl-nav-stack",
    props: {
        stack: {type: Object as PropType<Stack>, required: true},
    },
    setup({props}) {
        const parent = Nav.use.inject()
        const provideNav = provideNavPage({stack: props.stack, nav: parent.props.nav})

        return {
            refer: {
                provideNav,
            },
            render: () => (
                <div class="pl-nav-stack" v-show={props.stack.show}>
                    {props.stack.pages.map((page, index) => {
                        return (
                            <NavPage
                                key={page.id}
                                page={page}
                                isLast={index === props.stack.pages.length - 1}
                            />
                        )
                    })}
                </div>
            )
        }
    },
})