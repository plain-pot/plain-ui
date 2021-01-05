import {designComponent} from "../../../src/use/designComponent";
import './home.scss'
import {ProHomeMenu} from "./home-menu";
import {ProHomeHeader} from "./home-header";
import {ProHomeContent} from "./home-content";

export const ProHome = designComponent({
    name: 'pro-home',
    setup() {
        return {
            render: () => (
                <div class="pro-home">
                    <ProHomeMenu/>
                    <ProHomeHeader/>
                    <ProHomeContent/>
                </div>
            )
        }
    },
})