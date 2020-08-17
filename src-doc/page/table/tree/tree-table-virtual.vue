<template>
    <div class="tree-table-virtual">
        <demo-line>
            <pl-button-group>
                <pl-button label="全部展开" @click="$refs.tree.treePlc.methods.expandAll()"/>
                <pl-button label="全部收起" @click="$refs.tree.treePlc.methods.collapseAll()"/>
                <pl-button label="获取选中数据" @click="$message($refs.tree.treePlc.methods.getCheckedData().map(item=>item.name).join(','))"/>
            </pl-button-group>
        </demo-line>
        <pl-table :data="data"
                  keyField="id"
                  childrenField="subs">
            <plc-index/>
            <plc-tree ref="tree" showCheckbox>
                <template slot-scope="{row}" slot="content">
                    {{row.name}}
                </template>
            </plc-tree>
            <plc title="名称" field="id"/>
            <plc title="名称" field="name"/>
        </pl-table>
    </div>
</template>

<script>
    export default {
        name: "tree-table-virtual",
        data() {
            return {
                tableData: [],
            }
        },
        async mounted() {

            const req = new Request('http://193.112.75.134/server/address/queryPage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: {
                        page: 1,
                        pageSize: 4000,
                    }
                })
            });
            const data = await fetch(req)
            console.log(await data.json())

        }
    }
</script>

<style lang="scss">

</style>