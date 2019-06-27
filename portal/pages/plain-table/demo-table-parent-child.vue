<template>
    <div class="demo-table-parent-child">
        <plain-table :option="option">
            <pl-tc-column field="id" title="编号"/>
            <pl-tc-input field="label" title="显示值" required/>
            <pl-tc-input field="code" title="代码"/>
            <pl-tc-input field="type" title="类型"/>
        </plain-table>
    </div>
</template>

<script>
    export default {
        name: "demo-table-parent-child",
        data() {
            return {
                option: new PlainOption({
                    context: this,
                    module: 'lov',
                    urls: {
                        queryPage: 'lov/queryPage',
                    },
                    buttons: {
                        clearCacheButton: {
                            label: '清除缓存',
                            icon: 'pad-clear',
                            order: 200,
                            handler() {
                                this.$message.show('清除缓存')
                            },
                        }
                    }
                })
            }
        },
    }
</script>

<style lang="scss">
    .demo-table-parent-child {
        padding: 16px 0;
    }
</style>