<template>
    <div class="demo-dropdown">
        <im-demo-row title="基本用法">
            <im-dropdown>
                <im-button label="toggle"/>
                <template slot="popper">
                    <im-dropdown-item v-for="item in data" :label="item.name" :key="item.name" @click="$message.show(item.name)"/>
                </template>
            </im-dropdown>
        </im-demo-row>
        <im-demo-row title="设置图标">
            <im-dropdown>
                <im-button label="toggle"/>
                <template slot="popper">
                    <im-dropdown-item v-for="item in data" :label="item.name" :key="item.name" @click="$message.show({message:item.name,icon:item.icon})" :icon="item.icon"/>
                </template>
            </im-dropdown>
        </im-demo-row>
        <im-demo-row title="分割线">
            <im-dropdown>
                <im-button label="toggle"/>
                <template slot="popper">
                    <im-dropdown-item v-for="item in data" :label="item.name" :key="item.name" @click="$message.show({message:item.name,icon:item.icon})" :icon="item.icon" :baseLine="item.name === '谷歌'"/>
                </template>
            </im-dropdown>
        </im-demo-row>

        <im-demo-row title="任意目标">
            <im-dropdown>
                <span>toggle</span>
                <template slot="popper">
                    <im-dropdown-item v-for="item in data" :label="item.name" :key="item.name" @click="$message.show(item.name)"/>
                </template>
            </im-dropdown>
        </im-demo-row>
        <im-demo-row title="设置popover">
            <im-dropdown :popover="{popper:{arrow:false,disabledEqual:false}}">
                <im-button label="toggle"/>
                <template slot="popper">
                    <im-dropdown-item v-for="item in data" :label="item.name" :key="item.name" @click="$message.show(item.name)" :icon="item.icon"/>
                </template>
            </im-dropdown>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-dropdown",
        data() {
            return {
                data: [
                    {name: '推特', icon: 'pad-twitter-square-fill'},
                    {name: '腾讯QQ', icon: 'pad-QQ-square-fill'},
                    {name: 'IE浏览器', icon: 'pad-IE-square-fill'},
                    {name: '谷歌', icon: 'pad-google-square-fill'},
                    {name: '脸书', icon: 'pad-facebook-fill'},
                    {name: '亚马逊', icon: 'pad-amazon-square-fill'},
                    {name: '支付宝', icon: 'pad-alipay-square-fill'},
                    {name: '知乎', icon: 'pad-zhihu-circle-fill'},
                    {name: '微博', icon: 'pad-weibo-circle-fill'},
                    {name: '淘宝', icon: 'pad-taobao-circle-fill'},
                    {name: '苹果', icon: 'pad-apple-fill'},
                    {name: '安卓', icon: 'pad-android-fill'},
                ]
            }
        },
    }
</script>

<style lang="scss">
    .demo-dropdown {
        @at-root .demo-dropdown-box {
            width: 200px;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>