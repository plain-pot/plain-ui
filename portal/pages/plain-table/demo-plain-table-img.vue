<template>
    <div class="demo-plain-table-img">
        <plain-table :option="demoFieldOption">
            <!--            <pl-tc-column field="id" title="编号"/>-->
            <pl-tc-img field="imgId" src="imgPath"/>
            <pl-tc-input field="input" title="输入框" required/>
            <pl-tc-radio field="radio" title="单选复选框"/>
            <pl-tc-toggle field="toggle" title="开关选择框"/>
        </plain-table>
    </div>
</template>

<script>
    export default {
        name: "demo-plain-table-img",
        data() {
            return {
                demoFieldOption: new PlainOption({
                    context: this,
                    module: 'demoField',
                    bodyRowHeight: 80,
                    showNum: 5,
                    pageSize: 5,
                }),
            }
        },
    }
</script>

<style lang="scss">

</style>
