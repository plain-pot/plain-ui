<template>
    <div class="demo-table-config">

        <demo-row title="属性控制">
            <pl-form>
                <pl-form-item label="列宽（大小）">
                    <pl-input v-model="plc.width"/>
                </pl-form-item>
                <pl-form-item label="隐藏列">
                    <pl-checkbox label="隐藏名称" v-model="hide.name" width="50%"/>
                    <pl-checkbox label="隐藏评分" v-model="hide.star" width="50%"/>
                </pl-form-item>
                <pl-form-item label="固定">
                    <pl-checkbox label="颜色左固定" v-model="fixed.colorFixedLeft" width="50%"/>
                    <pl-checkbox label="名称左固定" v-model="fixed.nameFixedLeft" width="50%"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
        <demo-row title="不分组">
            <pl-table debugPlc :config="config">
                <plc field="id" title="编号" width="200px"/>
                <!--这里虽然通过props设置了宽度，但是因为 在config 中也配置了这一列的宽度，所以这里配置的不生效-->
                <plc field="size" title="大小" :width="plc.width"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色" :fixed="fixed.colorFixedLeft?'left':'center'"/>
                <plc field="name" title="名称" :hide="hide.name" :fixed="fixed.nameFixedLeft?'left':'center'"/>
                <plc field="star" title="评分" :hide="hide.star"/>
            </pl-table>
        </demo-row>
        <demo-row title="分组">
            <pl-table debugPlc>
                <plc field="id" title="编号"/>
                <plc-group title="第一组">
                    <plc field="size" title="大小" :width="plc.width"/>
                    <plc field="date" title="日期"/>
                </plc-group>
                <plc field="color" title="颜色"/>
                <plc-group title="第二组">
                    <plc field="name" title="名称" :hide="hide.name"/>
                    <plc field="star" title="评分" :hide="hide.star"/>
                </plc-group>
            </pl-table>
        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "table-config",
        data() {
            return {
                plc: {
                    width: 200,
                    align: 'left',
                    init: true,
                    order: 5,
                },
                hide: {
                    name: false,
                    star: false,
                },
                fixed: {
                    colorFixedLeft: false,
                    nameFixedLeft: false,
                }
            }
        },
        methods: {
            config(items) {
                return {
                    'size_大小': {
                        width: '1',
                    }
                }
            },
        }
    }
</script>

<style lang="scss">
    .demo-table-config {
        width: 1000px;
        margin-left: -130px;
    }
</style>