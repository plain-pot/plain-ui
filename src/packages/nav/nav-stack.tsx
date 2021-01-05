import {designComponent} from "../../use/designComponent";
import {PropType} from 'vue';
import {GetPage, Stack} from "./NavigatorManager";
import {NavPage} from "./nav-page";

export const NavStack = designComponent({
    name: "pl-nav-stack",
    props: {
        stack: {type: Object as PropType<Stack>, required: true},
        getPage: {type: Function as PropType<GetPage>, required: true},
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
                                getPage={props.getPage}
                                isLast={index === props.stack.pages.length - 1}
                            />
                        )
                    })}
                </div>
            )
        }
    },
})