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
    </div>
</template>

<script>
    export default {
        name: "demo-step",
        data() {
            return {
                val: 2,
                data: [
                    {title: '获取access_token', content: '点击检查问题，即可返回access_token，access_token的有效期是两小时，两小时之后须重新获取', icon: 'pad-android-fill'},
                    {title: '上传卡券logo', content: '点击检查问题，即可获取图片url，在下一步创建卡劵的参数中需要', icon: 'pad-apple-fill'},
                    {title: '创建卡券', content: 'date_info中用的是Unix时间戳，注意把begin_timestamp修改小于当前时间，end_timestamp修改成今天之后的时间，这样在后面核销卡劵测试才能成功', icon: 'pad-taobao-circle-fill'},
                    {title: '创建二维码投放', content: '创建二维码ticket接口', icon: 'pad-zhihu-circle-fill'},
                    {title: '显示二维码', content: '打开微信扫一扫，然后领取卡劵，如果显示卡劵未通过审核，那么需要下一步设置测试白名单，如果可以领取就忽略第六步。', icon: 'pad-weibo-circle-fill'},
                ]
            }
        },
    }
</script>

<style lang="scss">

</style>