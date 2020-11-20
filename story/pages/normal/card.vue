<template>
    <div class="demo-card">
        <demo-row title="基本用法">
            <pl-card title="卡片标题">
                <template #operator>
                    <pl-button label="更多" mode="text"/>
                </template>
                <div>卡片内容</div>
                <div>卡片内容</div>
                <div>卡片内容</div>
            </pl-card>
        </demo-row>
        <demo-row title="小型卡片">
            <pl-card title="小型卡片" mini>
                <template #operator>
                    <pl-button label="更多" mode="text"/>
                </template>
                <div>卡片内容</div>
                <div>卡片内容</div>
                <div>卡片内容</div>
            </pl-card>
        </demo-row>
        <demo-row title="阴影">
            <pl-card title="normal" shadow="normal">
                <template #operator>
                    <pl-button label="更多" mode="text"/>
                </template>
                <div>一直显示阴影</div>
            </pl-card>
            <pl-card title="hover" shadow="hover">
                <template #operator>
                    <pl-button label="更多" mode="text"/>
                </template>
                <div>鼠标悬浮显示阴影</div>
            </pl-card>
        </demo-row>
        <demo-row title="标题描述">
            <pl-card title="卡片标题" desc="标题下边的描述">
                <template #operator>
                    <pl-button label="更多" mode="text"/>
                </template>
                <div>卡片内容</div>
                <div>卡片内容</div>
                <div>卡片内容</div>
            </pl-card>
            <pl-card title="卡片标题" desc="标题下边的描述" mini>
                <template #operator>
                    <pl-button label="更多" mode="text"/>
                </template>
                <div>卡片内容</div>
                <div>卡片内容</div>
                <div>卡片内容</div>
            </pl-card>
            <pl-card>
                <template #title>
                    自定义标题
                    <pl-icon icon="el-icon-info" v-tooltip="'提示'"/>
                </template>
                <template #desc>
                    自定义标题描述
                    <pl-icon icon="el-icon-d-arrow-right" v-tooltip="'提示'"/>
                </template>
                <template #operator>
                    <pl-button label="更多" mode="text"/>
                </template>
                <div>卡片内容</div>
                <div>卡片内容</div>
                <div>卡片内容</div>
            </pl-card>
        </demo-row>
        <demo-row title="取消内边距">
            <pl-card title="卡片标题" noPadding>
                <template #operator>
                    <pl-button label="更多" mode="text"/>
                </template>
                <div>卡片内容</div>
                <div>卡片内容</div>
                <div>卡片内容</div>
            </pl-card>
        </demo-row>
        <demo-row title="海报图">
            <pl-card title="圣诞之夜" shadow="normal">
                <template #poster>
                    <img src="https://img.zcool.cn/community/01acd9554beac2000001bf72509649.jpg@1280w_1l_2o_100sh.jpg" style="width: 100%;height: auto"/>
                </template>
                <template #desc>
                    <div>1、有奖竞猜活动</div>
                    <div>2、大转盘抽奖</div>
                    <div>3、海量红包大礼</div>
                </template>
                <template #operator>
                    <pl-dropdown placement="right">
                        <template v-slot:reference="{open}">
                            <pl-button mode="text">
                                <span>更多</span>
                                <pl-icon :icon="open?'el-icon-arrow-up':'el-icon-arrow-down'"/>
                            </pl-button>
                        </template>
                        <template #popper>
                            <pl-dropdown-menu>
                                <pl-dropdown-option label="分享" @click="$message('分享')" icon="el-icon-share"/>
                                <pl-dropdown-option label="收藏" @click="$message('收藏')" icon="el-icon-star-off"/>
                                <pl-dropdown-option label="点赞" @click="$message('点赞')" icon="el-icon-thumb"/>
                            </pl-dropdown-menu>
                        </template>
                    </pl-dropdown>
                </template>
            </pl-card>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "card"
    }
</script>

<style lang="scss">

</style>