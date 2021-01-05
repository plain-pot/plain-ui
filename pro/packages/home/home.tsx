import {designComponent} from "../../../src/use/designComponent";
import './home.scss'
import {ProHomeMenu} from "./home-menu";
import {ProHomeHeader} from "./home-header";
import {ProHomeContent} from "./home-content";
import {PropType} from 'vue';
import {ProHomeMenuData} from "./home.utils";
import {NavigatorManager} from "../../../src/packages/nav/NavigatorManager";

export const ProHome = designComponent({
    name: 'pro-home',
    props: {
        menus: {type: Array as PropType<ProHomeMenuData[]>, required: true},
        nav: {type: Object as PropType<NavigatorManager>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pro-home">
                    <ProHomeMenu menus={props.menus} nav={props.nav}/>
                    <ProHomeHeader nav={props.nav}/>
                    <ProHomeContent nav={props.nav}/>
                </div>
            )
        }
    },
})