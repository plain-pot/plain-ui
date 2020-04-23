<template>
    <div class="demo-table-basic">
        <demo-row title="基础用法">
            <pl-form>
                <pl-form-item label="列宽度响应测试">
                    <pl-input v-model="width"/>
                </pl-form-item>
                <pl-form-item label="列销毁测试">
                    <pl-toggle v-model="init"/>
                </pl-form-item>
                <pl-form-item label="文本对齐方式">
                    <pl-radio-group v-model="align">
                        <pl-radio label="left" val="left"/>
                        <pl-radio label="center" val="center"/>
                        <pl-radio label="right" val="right"/>
                    </pl-radio-group>
                </pl-form-item>
                <pl-form-item label="带边框">
                    <pl-checkbox v-model="border"/>
                </pl-form-item>
            </pl-form>
            <pl-table :data="tableData" :border="border">
                <plc-list>
                    <plc field="id" title="编号" :width="width" :align="align"/>
                    <plc field="size" title="大小" :align="align"/>
                    <plc-group title="地址" :align="align">
                        <plc field="date" title="日期" :align="align"/>
                        <plc field="color" title="颜色" :align="align"/>
                        <plc-list>
                            <plc field="name" title="名称" v-if="init" :align="align"/>
                        </plc-list>
                    </plc-group>
                </plc-list>
                <plc field="star" title="评分" :align="align"/>

                <!--<plc field="id" title="编号"/>
                <plc field="size" title="大小"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色"/>
                <plc field="name" title="名称" v-if="init"/>
                <plc field="star" title="评分"/>-->

            </pl-table>
        </demo-row>
    </div>
</template>

<script>

    import data from '../data/data-1'

    export default {
        name: "table-basic",
        data() {
            // const {color, date, id, name, size, star} = {}
            return {
                tableData: data,
                init: true,
                width: '200px',

                align: 'left',
                border: true,
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss">

</style>