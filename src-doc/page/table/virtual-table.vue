<template>
    <div class="virtual-table">
        <demo-row title="基本用法">
            <div style="height: 400px;overflow: hidden">
                <pl-virtual-table :data="tableData" :size="40" :width="3000">
                    <template slot-scope="{item,index}">
                        <pl-item tag="tr" :key="index" :vid="index">
                            <td style="height: 40px;">{{JSON.stringify(item)}}</td>
                        </pl-item>
                    </template>
                </pl-virtual-table>
            </div>
        </demo-row>
    </div>
</template>

<script>
    import data from '../data/data'

    export default {
        name: "virtual-table",
        data() {
            return {
                tableData: data,
            }
        },
    }
</script>

<style lang="scss">

</style>