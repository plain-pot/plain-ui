<template>
    <div class="demo-row">
        <div v-if="!!title" class="demo-row-title">{{title}}</div>
        <div class="demo-row-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "demo-row",
        props: {
            title: {},
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-row {
        .demo-row-title {
            border-bottom: dashed 1px #f1f1f1;
            font-size: 14px;
            padding: 14px 24px;
            color: #606266;
        }

        .demo-row-content {
            padding: 16px 24px;
        }
    }
</style>