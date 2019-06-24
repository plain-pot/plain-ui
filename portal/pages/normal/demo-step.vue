<template>
    <div class="demo-step">
        <im-demo-row title="步骤">
            <im-button-group>
                <im-button label="上一步" @click="val -= 1"/>
                <im-button label="下一步" @click="val += 1"/>
            </im-button-group>

        </im-demo-row>
        <im-demo-row title="基本用法">
            <im-step-container :value="val">
                <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index"/>
            </im-step-container>
            <im-step-container :value="val">
                <im-step v-for="(item,index) in data" :title="item.title" :key="index"/>
            </im-step-container>
        </im-demo-row>
        <im-demo-row title="设置图标">
            <im-step-container :value="val">
                <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :icon="item.icon"/>
            </im-step-container>
        </im-demo-row>
        <im-demo-row title="迷你步骤条">
            <im-demo-row-item>
                <im-step-container :value="val" mini>
                    <im-step v-for="(item,index) in data" :title="item.title" :key="index" :content="item.content"/>
                </im-step-container>
            </im-demo-row-item>
            <im-demo-row-item>
                <im-step-container :value="val" mini>
                    <im-step v-for="(item,index) in data" :title="item.title" :key="index" :icon="item.icon"/>
                </im-step-container>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="设置状态">
            <im-step-container :value="val">
                <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :icon="item.icon" :status="val === index?'error':null"/>
            </im-step-container>
            <im-step-container :value="val">
                <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :icon="item.icon" :status="val === index?'success':null"/>
            </im-step-container>
        </im-demo-row>

        <im-demo-row title="纵向步骤条">
            <im-demo-row-item>
                <im-step-container :value="val" vertical>
                    <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :status="val === index?'success':null"/>
                </im-step-container>
            </im-demo-row-item>
            <im-demo-row-item>
                <im-step-container :value="val" vertical mini>
                    <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :status="val === index?'success':null"/>
                </im-step-container>
            </im-demo-row-item>
            <im-demo-row-item>
                <im-step-container :value="val" vertical mini>
                    <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :icon="item.icon" :key="index" :status="val === index?'success':null"/>
                </im-step-container>
            </im-demo-row-item>
            <im-demo-row-item>
                <im-step-container :value="val" vertical>
                    <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :icon="item.icon" :status="val === index?'error':null"/>
                </im-step-container>
                <im-step-container :value="val" vertical>
                    <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :icon="item.icon" :status="val === index?'success':null"/>
                </im-step-container>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="纵向反转">
            <im-step-container :value="val" vertical reverse>
                <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :status="val === index?'success':null"/>
            </im-step-container>
        </im-demo-row>

        <im-demo-row title="自定义标题以及内容">
            <im-demo-row-item>
                <im-step-container :value="val">
                    <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :status="val === index?'success':null">
                        <div slot="title">
                            【标题】:{{item.title}}
                        </div>
                        <div slot="content">
                            【内容】：{{item.content}}
                        </div>
                    </im-step>
                </im-step-container>
            </im-demo-row-item>
            <im-demo-row-item>
                <im-step-container :value="val" vertical>
                    <im-step v-for="(item,index) in data" :title="item.title" :content="item.content" :key="index" :status="val === index?'success':null">
                        <div slot="title">
                            【标题】:{{item.title}}
                        </div>
                        <div slot="content">
                            【内容】：{{item.content}}
                        </div>
                    </im-step>
                </im-step-container>
            </im-demo-row-item>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-step",
        data() {
            return {
                val: 2,
                data: [
                    {title: '获取token', content: '调用接口，获取token', icon: 'pad-android-fill'},
                    {title: '上传卡券logo', content: '使用token上传logo图片', icon: 'pad-apple-fill'},
                    {title: '创建卡券', content: '调用接口创建卡券信息', icon: 'pad-taobao-circle-fill'},
                    {title: '创建二维码', content: '调用接口创建二维码', icon: 'pad-zhihu-circle-fill'},
                    {title: '显示二维码', content: '在应用中显示二维码', icon: 'pad-weibo-circle-fill'},
                ]
            }
        },
    }
</script>

<style lang="scss">

</style>