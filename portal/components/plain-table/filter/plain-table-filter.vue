<template>
    <div class="plain-table-filter">
        <pl-select :input="{width:120}" class="plain-table-filter-field-select plain-table-filter-clear-right-radio" :data="data" :labelKey="labelKey" :valueKey="valueKey" :value="searchField"/>
        <pl-input class="plain-table-filter-type plain-table-filter-clear-left-radio plain-table-filter-clear-right-radio"/>
        <pl-button label="查询" shape="none" class="plain-table-filter-search-button plain-table-filter-clear-left-radio" icon="pad-search"/>
    </div>
</template>

<script>
    export default {
        name: "plain-table-filter",
        props: {
            data: {type: Array},
            labelKey: {type: String},
            valueKey: {type: String},
            searchField: {type: String},
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .plain-table-filter {
            display: inline-block;
            position: relative;

            .plain-table-filter-clear-left-radio {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }

            .plain-table-filter-clear-right-radio {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            .plain-table-filter-field-select {
                margin-right: -1px;
            }

            .plain-table-filter-type, .plain-table-filter-field-select {
                border-color: plVar(colorBorder) !important;
            }

            .plain-table-filter-search-button {
                margin-left: -1px;
            }
        }
    }
</style>
