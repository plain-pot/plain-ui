<template>
    <div class="table-class-style">
        <demo-row title="rowClassFunc">
            <pl-table :data="data" :rowClassFunc="rowClassFunc">
                <plc field="id" title="编号"/>
                <plc field="size" title="大小"/>
                <plc field="date" title="日期"/>
                <plc field="color" title="颜色"/>
                <plc field="name" title="名称"/>
                <plc field="star" title="评分"/>
            </pl-table>
        </demo-row>
    </div>
</template>

<script>

    import data from "../data/data-1.json";

    export default {
        name: "table-class-style",
        data() {
            return {
                data,
            }
        },
        methods: {
            rowClassFunc({data}) {
                const {star} = data
                return [
                    'custom-row',
                    `custom-row-status-${star > 5 ? 'active' : 'inactive'}`
                ]
            },
        }
    }
</script>

<style lang="scss">
    .custom-row {
        &.custom-row-status-active {
            td {
                background-color: rgba(#3E97EC, 0.1) !important;
            }
        }
    }
</style>