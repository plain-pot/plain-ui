<template>
    <div class="demo-table-parent-child">
        <plain-table :option="provinceOption">
            <pl-tc-column field="id" title="编号"/>
            <pl-tc-input field="name" title="地址名称" required width="100px" tooltip/>
            <pl-tc-input field="code" title="地址代码" width="100px" required/>
            <pl-tc-input field="longitude" title="经度" width="100px"/>
            <pl-tc-input field="latitude" title="纬度" width="100px"/>
            <pl-tc-input field="deep" title="地址级别" width="100px"/>
        </plain-table>

        <plain-table :option="cityOption">
            <pl-tc-column field="id" title="编号"/>
            <pl-tc-input field="name" title="地址名称" required width="100px" tooltip/>
            <pl-tc-input field="code" title="地址代码" width="100px" required/>
            <pl-tc-column field="parentName" title="父级地址名称" width="100px" tooltip/>
            <pl-tc-column field="parentCode" title="父级地址代码" width="100px"/>
            <pl-tc-input field="longitude" title="经度" width="100px"/>
            <pl-tc-input field="latitude" title="纬度" width="100px"/>
            <pl-tc-input field="deep" title="地址级别" width="100px"/>
        </plain-table>

        <plain-table :option="areaOption">
            <pl-tc-column field="id" title="编号"/>
            <pl-tc-input field="name" title="地址名称" required width="100px" tooltip/>
            <pl-tc-input field="code" title="地址代码" width="100px" required/>
            <pl-tc-input field="parentName" title="父级地址名称" width="100px" tooltip/>
            <pl-tc-input field="parentCode" title="父级地址代码" width="100px"/>
            <pl-tc-input field="longitude" title="经度" width="100px"/>
            <pl-tc-input field="latitude" title="纬度" width="100px"/>
            <pl-tc-input field="deep" title="地址级别" width="100px"/>
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
                showNum: 5,
                pageSize: 5,
                defaultNewRow: {
                    deep: '0',
                },
                filters: [
                    {field: 'deep', value: '0'}
                ]
            })
            const cityOption = new PlainOption({
                context: this,
                module: 'address',
                sortField: 'code',
                sortDesc: false,
                showNum: 5,
                pageSize: 5,
                defaultId: true,
                defaultNewRow: {
                    deep: '1',
                },
                filters: [
                    {field: 'deep', value: '1'}
                ],
                parentOption: provinceOption,
                map: {
                    parentCode: 'code',
                    parentName: 'name'
                },
            })
            const areaOption = new PlainOption({
                context: this,
                module: 'address',
                sortField: 'code',
                sortDesc: false,
                showNum: 5,
                pageSize: 5,
                defaultNewRow: {
                    deep: '2',
                },
                filters: [
                    {field: 'deep', value: '2'}
                ],
                parentOption: cityOption,
                map: {
                    parentCode: 'code',
                    parentName: 'name'
                },
            })
            return {
                provinceOption,
                cityOption,
                areaOption,
            }
        },
    }
</script>

<style lang="scss">
    .demo-table-parent-child {
        padding: 16px 0;
        box-sizing: border-box;
    }
</style>