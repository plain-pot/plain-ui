import {designComponent} from "../../../src/use/designComponent";
import './home.scss'
import {ProHomeMenu} from "./home-menu";
import {ProHomeHeader} from "./home-header";
import {ProHomeContent} from "./home-content";
import {PropType} from 'vue';
import {ProHomeMenuData} from "./home.utils";

export const ProHome = designComponent({
    name: 'pro-home',
    props: {
        menus: {type: Array as PropType<ProHomeMenuData[]>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pro-home">
                    <ProHomeMenu menus={props.menus}/>
                    <ProHomeHeader/>
                    <ProHomeContent/>
                </div>
            )
        }
    },
})