<template>
    <div class="demo-plain-table">
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
        name: "demo-plain-table",
        data() {
            return {
                option: new PlainOption({
                    context: this,
                    module: 'lov',
                    pageSize: 5,
                    urls: {
                        queryPage: 'lov/queryPage',
                    }
                })
            }
        },
    }
</script>

<style lang="scss">
    .demo-plain-table {
        box-sizing: border-box;
        padding: 16px 0;
    }
</style>