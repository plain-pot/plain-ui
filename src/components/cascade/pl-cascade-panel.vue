<template>
    <div class="pl-cascade-panel">
        pl-cascade-panel
    </div>
</template>

<script>
    export default {
        name: "pl-cascade-panel",
        props: {
            value: {type: Array},                                   // 数组，双向绑定值
            data: {type: Array},                                    // 选择的数据
            expandTrigger: {type: Array},                           // 展开触发类型：click，hover
            showFormat: {type: Function},                           // 格式化显示值函数
            separator: {type: String, default: ' / '},              // 显示值分隔符
            filterable: {type: Boolean},                            // 是否可筛选
            filterMethod: {type: Boolean},                          // 自定义筛选函数

            multiple: {type: Boolean},                              // 多选
            collapseTags: {type: Boolean},                          // 多选情况下，是否折叠多出来的显示标签
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>