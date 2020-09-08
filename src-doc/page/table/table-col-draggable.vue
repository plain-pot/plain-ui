<template>
    <div class="table-col-draggable">
        <demo-row title="基本用法">
            <pl-table :data="data" colDraggable border>
                <plc field="id" title="1" fixed="left"/>
                <plc-group title="2">
                    <plc field="size" title="2-1"/>
                    <plc field="date" title="2-2"/>
                </plc-group>
                <plc field="color" title="3"/>
                <plc-group title="4">
                    <plc-group title="4-1">
                        <plc field="name" title="4-1-1"/>
                        <plc field="star" title="4-1-2"/>
                    </plc-group>
                    <plc field="id" title="4-2"/>
                </plc-group>
                <plc field="size" title="5"/>
                <plc field="date" title="6"/>
                <plc field="color" title="7"/>
                <plc field="name" title="8"/>
                <plc field="star" title="9"/>
            </pl-table>
        </demo-row>
    </div>
</template>

<script>

    import data from "../data/data-1.json";

    export default {
        name: "table-col-draggable",
        data() {
            return {
                data,
            }
        },
    }
</script>

<style lang="scss">

</style>