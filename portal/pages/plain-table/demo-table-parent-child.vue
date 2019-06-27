<template>
    <div class="demo-table-parent-child">
        <plain-table :option="provinceOption">
            <pl-tc-column field="id" title="编号"/>
            <pl-tc-input field="name" title="地址名称" required/>
            <pl-tc-input field="code" title="地址代码"/>
            <!--            <pl-tc-input field="parentName" title="父级地址名称"/>-->
            <!--            <pl-tc-input field="parentCode" title="父级地址代码"/>-->
            <pl-tc-input field="longitude" title="经度"/>
            <pl-tc-input field="latitude" title="纬度"/>
            <pl-tc-input field="deep" title="地址级别"/>
        </plain-table>

        <plain-table :option="cityOption">
            <pl-tc-column field="id" title="编号"/>
            <pl-tc-input field="name" title="地址名称" required/>
            <pl-tc-input field="code" title="地址代码"/>
            <pl-tc-input field="parentName" title="父级地址名称"/>
            <pl-tc-input field="parentCode" title="父级地址代码"/>
            <pl-tc-input field="longitude" title="经度"/>
            <pl-tc-input field="latitude" title="纬度"/>
            <pl-tc-input field="deep" title="地址级别"/>
        </plain-table>
    </div>
</template>

<script>
    export default {
        name: "demo-table-parent-child",
        data() {
            const provinceOption = new PlainOption({
                context: this,
                module: 'address',
                sortField: 'code',
                sortDesc: false,
                filters: [
                    {field: 'deep', value: '0'}
                ]
            })
            const cityOption = new PlainOption({
                context: this,
                module: 'address',
                sortField: 'code',
                sortDesc: false,
                filters: [
                    {field: 'deep', value: '1'}
                ],
                parentOption: provinceOption,
                map: {
                    parentCode: 'code'
                },
            })
            return {
                provinceOption,
                cityOption,
            }
        },
    }
</script>

<style lang="scss">
    .demo-table-parent-child {
        padding: 16px 0;
    }
</style>