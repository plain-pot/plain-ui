<template>
    <div class="demo-tag">
        <im-demo-row title="基本用法">
            <im-tag label="针织"/>
            <im-tag label="棉纺"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-tag v-for="item in colors" :key="item" :label="item" :color="item"/>
        </im-demo-row>
        <im-demo-row title="可删除">
            <im-tag v-for="item in colors" :key="item" :label="item" :color="item" close @click="$message.show('click:'+item)" @close="$message.show('close:'+item)"/>
        </im-demo-row>
        <im-demo-row title="大小尺寸">
            <im-tag v-for="item in ['large','default','small']" :key="item" :label="item" :size="item"/>
        </im-demo-row>
        <im-demo-row title="自定义渲染内容">
            <im-tag>
                <im-icon icon="pad-plus"/>
                <span>搜索</span>
                <im-icon icon="pad-search"/>
            </im-tag>
        </im-demo-row>
        <im-demo-row title="标签输入框">
            <im-tag-input :data="['北京','上海','广州']"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-tag",
        data() {
            return {
                colors: ['primary', 'success', 'warn', 'error', 'info', 'disabled']
            }
        },
    }
</script>

<style lang="scss">

</style>