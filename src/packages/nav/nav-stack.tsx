import {designComponent} from "../../use/designComponent";
import {PropType} from 'vue';
import {Stack} from "./NavigatorManager";
import {NavPage} from "./nav-page";

export const NavStack = designComponent({
    name: "pl-nav-stack",
    props: {
        stack: {type: Object as PropType<Stack>, required: true},
    },
    setup({props}) {
        return {
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