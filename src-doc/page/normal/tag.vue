<template>
    <div class="demo-tag">
        <demo-row title="基本用法">
            <pl-tag label="标签"/>
        </demo-row>

        <demo-row title="删除图标">
            <pl-tag label="标签" close @click="$message('click')" @close="$message.warn('close')"/>
        </demo-row>

        <demo-row title="状态">
            <pl-tag v-for="item in status" :key="item" :status="item" :label="item"/>
        </demo-row>

        <demo-row title="类型">
            <pl-tag label="标签" mode="fill"/>
            <pl-tag label="标签" mode="stroke"/>
            <pl-tag label="标签" mode="text"/>
        </demo-row>

        <demo-row title="大小">
            <pl-tag v-for="item in sizes" :key="item" :label="item" :size="item"/>
        </demo-row>

        <demo-row title="禁用">
            <pl-tag label="标签" mode="fill" disabled/>
            <pl-tag label="标签" mode="stroke" disabled/>
            <pl-tag label="标签" mode="text" disabled/>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "tag",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>