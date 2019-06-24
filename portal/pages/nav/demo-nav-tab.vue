<template>
    <div class="demo-nav-tab">
        <im-demo-row>
            <im-demo-row-item title="操作按钮">
                <im-button label="打开【Color推荐】" @click="$refs.tabs1.push('/normal/demo-color','Color推荐')"/>
                <im-button label="打开【Icon图标设置】" @click="$refs.tabs1.push('/normal/demo-icon','Icon图标设置')"/>
                <im-button label="打开【Radio单选复选】" @click="$refs.tabs1.push('/normal/demo-radio','Radio单选复选')"/>
            </im-demo-row-item>
            <im-nav-tab height="300px" ref="tabs1"/>
        </im-demo-row>
        <im-demo-row title="初始化的时候就显示可以打开的页面">
            <im-nav-tab height="300px"
                                :init-pages="[
                                {title:'Color推荐',path:'/normal/demo-color'},
                                {title:'Icon图标设置',path:'/normal/demo-icon'},
                                {title:'Radio单选复选',path:'/normal/demo-radio'},
                            ]"/>
        </im-demo-row>

        <im-demo-row title="同一個页面是否可以打开多次">
            <im-demo-row-item title="操作按钮">
                <im-button label="打开【Color推荐】" @click="$refs.tabs2.push('/normal/demo-color','Color推荐')"/>
                <im-button label="打开【Icon图标设置】" @click="$refs.tabs2.push('/normal/demo-icon','Icon图标设置')"/>
                <im-button label="打开【Radio单选复选】" @click="$refs.tabs2.push('/normal/demo-radio','Radio单选复选',count++)"/>
                <im-button label="打开【Test测试页面】" @click="$refs.tabs2.push('/normal/demo-test','Test测试页面',count++)"/>
            </im-demo-row-item>
            <im-nav-tab height="300px" ref="tabs2" multiple/>
        </im-demo-row>

        <im-demo-row title="设置id，缓存页面，刷新之后打开原来正在查看的页面">
            <im-demo-row-item title="操作按钮">
                <im-button label="打开【Color推荐】" @click="$refs.tabs3.push('/normal/demo-color','Color推荐')"/>
                <im-button label="打开【Icon图标设置】" @click="$refs.tabs3.push('/normal/demo-icon','Icon图标设置')"/>
                <im-button label="打开【Radio单选复选】" @click="$refs.tabs3.push('/normal/demo-radio','Radio单选复选')"/>
            </im-demo-row-item>
            <im-nav-tab height="300px" ref="tabs3" id="1545826196135"/>
        </im-demo-row>

        <im-demo-row title="双向绑定控制页面切换">
            <im-demo-row-item title="操作按钮">
                <im-button-group>
                    <im-button label="打开【Color推荐】" @click="$refs.tabs4.push('/normal/demo-color','Color推荐')"/>
                    <im-button label="打开【Icon图标设置】" @click="$refs.tabs4.push('/normal/demo-icon','Icon图标设置')"/>
                    <im-button label="打开【Radio单选复选】" @click="$refs.tabs4.push('/normal/demo-radio','Radio单选复选')"/>
                </im-button-group>
                <im-button-group>
                    <im-button label="前一页" @click="index--"/>
                    <im-button label="后一页" @click="index++"/>
                    <im-button :label="`index:${index}`"/>
                </im-button-group>
            </im-demo-row-item>
            <im-nav-tab height="300px" ref="tabs4" v-model="index"/>
        </im-demo-row>

    </div>
</template>

<script>
    export default {
        name: "demo-nav-tab",
        data() {
            return {
                count: 1,
                index: 0,
            }
        },
    }
</script>

<style lang="scss">

</style>