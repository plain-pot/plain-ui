import {designComponent} from "../../use/designComponent";
import {PropType} from 'vue';
import {NavigatorManager} from "./NavigatorManager";
import './nav.scss'
import {NavPage} from "./nav-page";

export default designComponent({
    name: 'pl-nav',
    props: {
        nav: {type: Object as PropType<NavigatorManager>, required: true},
        height: {default: '100vh'},
        width: {default: '100vw'},
    },
    setup({props}) {
        // console.log(props.nav)
        return {
            render: () => {
                return (
                    <div class="pl-nav" style={{width: props.width, height: props.height}}>
                        {props.nav.state.stacks.map(stack => (
                            <div class="pl-nav-stack">
                                {stack.pages.map((page, index) => {
                                    return (
                                        <NavPage
                                            key={page.id}
                                            page={page}
                                            getPage={props.nav.utils.getPage}
                                            isLast={index === stack.pages.length - 1}
                                        />
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                )
            }
        }
    },
})