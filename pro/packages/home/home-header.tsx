import {designComponent} from "../../../src/use/designComponent";
import {NavigatorManager} from "../../../src/packages/nav/NavigatorManager";
import {PropType} from 'vue';

export const ProHomeHeader = designComponent({
    props: {
        nav: {type: Object as PropType<NavigatorManager>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pro-home-header">
                    <div class="pro-home-header-info">
                        <div>
                            <div class="pro-home-header-info-item">
                                <pl-icon icon="el-icon-s-fold"/>
                            </div>
                        </div>
                        <div>
                            <div class="pro-home-header-info-item">
                                <pl-icon icon="el-icon-search"/>
                            </div>
                            <div class="pro-home-header-info-item">
                                <pl-icon icon="el-icon-question"/>
                            </div>
                            <div class="pro-home-header-info-item">
                                <pl-badge dot>
                                    <pl-icon icon="el-icon-message-solid"/>
                                </pl-badge>
                            </div>
                            <pl-dropdown
                                placement="bottom"
                                trigger="hover"
                                v-slots={{
                                    default: () => (
                                        <div class="pro-home-user-info">
                                            <span class="pro-home-user-avatar">
                                                <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" alt="avatar"/>
                                            </span>
                                            <span class="pro-home-user-name">
                                                ADMIN，系统管理员职位
                                            </span>
                                        </div>
                                    ),
                                    popper: () => (
                                        <pl-dropdown-menu>
                                            <pl-dropdown-group>
                                                <pl-dropdown-option label="个人中心" icon="el-icon-s-custom"/>
                                                <pl-dropdown-option label="个人设置" icon="el-icon-s-tools"/>
                                            </pl-dropdown-group>
                                            <pl-dropdown-group>
                                                <pl-dropdown-option label="退出登录" icon="el-icon-switch-button"/>
                                            </pl-dropdown-group>
                                        </pl-dropdown-menu>
                                    )
                                }}
                            />
                        </div>
                    </div>
                    <div class="pro-home-header-tabs">
                        <pl-scroll fitHostWidth scrollY={false}>
                            <div class="pro-home-header-tab-list">
                                {props.nav.state.stacks.sort((a, b) => a.id.localeCompare(b.id)).map((stack, index) => (
                                    <div class="pro-home-header-tab" key={index}>
                                        {!!stack.pageConfig.icon && <pl-icon icon={stack.pageConfig.icon}/>}
                                        <span>
                                    {typeof stack.pageConfig.title === "string" ? stack.pageConfig.title : stack.pageConfig.title(stack.pageConfig)}
                                </span>
                                    </div>
                                ))}
                            </div>
                        </pl-scroll>
                    </div>
                </div>
            )
        }
    },
})