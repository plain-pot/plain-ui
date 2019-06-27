<template>
    <div class="demo-imp-list">
        <plain-table :option="impOption">
            <pl-tc-column field="id" title="编号"/>
            <pl-tc-input field="name" title="导入模板名称" required/>
            <pl-tc-input field="code" title="导入模板代码" required/>
            <pl-tc-input field="comments" title="备注"/>
        </plain-table>
    </div>
</template>

<script>
    export default {
        name: "demo-imp-list",
        data() {
            const impOption = new PlainOption({
                context: this,
                module: 'imp',
                showNum: 5,
                pageSize: 5,
            })
            return {
                impOption,
            }
        },
    }
</script>

<style lang="scss">

</style>