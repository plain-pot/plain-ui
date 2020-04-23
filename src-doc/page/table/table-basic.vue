<template>
    <div class="demo-table-basic">
        <demo-row title="基础用法">
            <demo-line>
                <pl-toggle v-model="init"/>
                <pl-input v-model="width"/>
            </demo-line>
            <pl-table :data="tableData">
                <plc-list>
                    <plc field="id" title="编号" :width="width"/>
                    <plc field="size" title="大小"/>
                    <plc-group title="地址">
                        <plc field="date" title="日期"/>
                        <plc field="color" title="颜色"/>
                        <plc-list>
                            <plc field="name" title="名称" v-if="init"/>
                        </plc-list>
                    </plc-group>
                </plc-list>
                <plc field="star" title="评分"/>

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
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss">

</style>