<template>
    <tr class="pl-base-table-row-space">
        <td v-for="(col,colIndex) in bodyColumns" :key="colIndex">
            <div :style="{width:$plain.$utils.unit(col.width)}"></div>
        </td>
    </tr>
</template>

<script>
    export default {
        name: "pl-base-table-row-space",
        props: {
            bodyColumns: {},
        },
    }
</script>

<style lang="scss">
</style>
