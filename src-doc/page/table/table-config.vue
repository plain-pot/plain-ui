<template>
    <div class="demo-table-config">

        <demo-row title="属性控制">
            <pl-form>
                <pl-form-item label="列宽（大小）">
                    <pl-input v-model="plc.width"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
        <demo-row title="不分组">
            <pl-table debugPlc :config="config">
                <plc field="id" title="编号" width="200px"/>
                <plc field="size" title="大小" :width="plc.width"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色"/>
                <plc field="name" title="名称"/>
                <plc field="star" title="评分"/>
            </pl-table>
        </demo-row>
        <demo-row title="分组">
            <pl-table debugPlc :config="config">
                <plc field="id" title="编号"/>
                <plc-group title="第一组">
                    <plc field="size" title="大小" :width="plc.width"/>
                    <plc field="date" title="日期"/>
                </plc-group>
                <plc field="color" title="颜色"/>
                <plc-group title="第二组">
                    <plc field="name" title="名称"/>
                    <plc field="star" title="评分"/>
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
            }
        },
        methods: {
            config(items) {
                return {
                    'size_大小': {
                        width: '500',
                    }
                }
            },
        }
    }
</script>

<style lang="scss">

</style>