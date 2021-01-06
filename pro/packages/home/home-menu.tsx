import {designComponent} from "../../../src/use/designComponent";
import {PropType} from 'vue';
import {ProHomeMenuItem} from "./home-menu-item";
import {NavigatorManager} from "../../../src/packages/nav/NavigatorManager";
import {ProHomeMenuData} from "../../pro.menu";

export const ProHomeMenu = designComponent({
    props: {
        menus: {type: Array as PropType<ProHomeMenuData[]>, required: true},
        nav: {type: Object as PropType<NavigatorManager>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pro-home-menu">
                    <div class="pro-home-menu-header">
                        <span>PLAINUIPRO</span>
                        <pl-input prefixIcon="el-icon-search" size="mini" shape="round"/>
                    </div>
                    <div class="pro-home-menu-content">
                        <pl-scroll fitHostWidth>
                            {props.menus.map((menu, index) => <ProHomeMenuItem key={index} menu={menu} nav={props.nav}/>)}
                        </pl-scroll>
                    </div>
                </div>
            )
        }
    },
})