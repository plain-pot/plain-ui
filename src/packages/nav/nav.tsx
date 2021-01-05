import {designComponent} from "../../use/designComponent";
import {PropType} from 'vue';
import {NavigatorManager} from "./NavigatorManager";
import './nav.scss'
import {NavStack} from "./nav-stack";

export default designComponent({
    name: 'pl-nav',
    provideRefer: true,
    props: {
        nav: {type: Object as PropType<NavigatorManager>, required: true},
        height: {default: '100vh'},
        width: {default: '100vw'},
    },
    setup({props}) {
        return {
            refer: {
                props,
            },
            render: () => {
                return (
                    <div class="pl-nav" style={{width: props.width, height: props.height}}>
                        {props.nav.state.stacks
                            .map(stack => (<NavStack stack={stack} key={stack.id}/>))}
                    </div>
                )
            }
        }
    },
})