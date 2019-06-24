<template>
    <div class="demo-base-table-methods">
        <im-demo-row>
            <pl-button label="选中特定行" @click="selectRow"/>
            <pl-number v-model="selectIndex"/>
        </im-demo-row>
        <im-demo-row>
            <pl-button label="开启选中状态" @click="$refs.table.startSelected()"/>
            <pl-button label="结束选中状态" @click="$refs.table.finishSelected()"/>
            <pl-button label="获取选中数据" @click="getSelected"/>
            <pl-button label="选中行" @click="checkRow"/>
            <pl-button label="取消选中行" @click="uncheckRow"/>
            <pl-number v-model="checkIndex"/>
        </im-demo-row>
        <im-demo-row>
            <im-base-table :data="data" id="trainno" ref="table">
                <im-tc-column title="类型" field="type"/>
                <im-tc-column title="用时" field="costtime"/>
            </im-base-table>
        </im-demo-row>

    </div>
</template>

<script>

    import {TableData} from "../../data";

    export default {
        name: "demo-base-table-methods",
        data() {
            return {
                data: TableData,
                selectIndex: 1,
                checkIndex: 1,
            }
        },
        methods: {
            selectRow() {
                this.$refs.table.selectRow({index: this.selectIndex})
            },
            async getSelected() {
                console.log(await this.$refs.table.getSelected())
            },
            checkRow() {
                this.$refs.table.checkRow({index: this.checkIndex})
            },
            uncheckRow() {
                this.$refs.table.uncheckRow({index: this.checkIndex})
            },
        }
    }
</script>

<style lang="scss">
    .demo-base-table-methods {
    }
</style>
