import {designComponent} from "../../use/designComponent";
import {PropType} from 'vue';
import {NavRouteMode, StackPage} from "./nav.utils";

export default designComponent({
    name: 'pl-nav',
    props: {
        routeMode: {type: String as PropType<NavRouteMode>, default: NavRouteMode.hash},                // 路由模式，解析url的时候是哈希路由还是history路由
        defaultPage: {type: Object as PropType<StackPage>},                                             // 当没有指定路由，也没有缓存的页面时，默认打开的页面
        maxStack: {type: Number, default: 20},                                                          // 最大的可以打开的stack个数
        storageKey: {type: String, required: true}                                                      // 多页面应用中可能会存在缓存冲突的问题。通过这个属性可以隔离多页面应用之间的缓存

    },
    setup() {
        return {
            render: () => {
                return (
                    <div>
                        i am nav
                    </div>
                )
            }
        }
    },
})