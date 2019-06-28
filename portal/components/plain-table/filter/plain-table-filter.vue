<template>
    <div class="plain-table-filter">
        <pl-select :input="{width:120}" class="plain-table-filter-field-select plain-table-filter-clear-right-radio" :data="data" :labelKey="labelKey" :valueKey="valueKey" :value="searchField"/>
        <div class="plain-table-filter-type plain-table-filter-clear-left-radio plain-table-filter-clear-right-radio">
            <component :is="searchType"/>
        </div>
        <pl-button label="查询" shape="none" class="plain-table-filter-search-button plain-table-filter-clear-left-radio" icon="pad-search"/>
    </div>
</template>

<script>

    import FilterInput from './item/plain-table-filter-input'
    import FilterDate from './item/plain-table-filter-date'
    import FilterNumber from './item/plain-table-filter-number'
    import FilterOv from './item/plain-table-filter-ov'

    const SEARCH_MAP = {
        'input': FilterInput,
        'date': FilterDate,
        'number': FilterNumber,
        'ov': FilterOv,
    }

    export default {
        name: "plain-table-filter",
        props: {
            data: {type: Array},
            labelKey: {type: String},
            valueKey: {type: String},
            searchField: {type: String},
        },
        computed: {
            searchType() {
                if (!this.searchField || !this.data || this.data.length === 0) return 'input'
                let searchType;
                for (let i = 0; i < this.data.length; i++) {
                    const item = this.data[i];
                    if (item.field === this.searchField) {
                        searchType = item.searchType
                    }
                }
                if (!searchType) searchType = 'input'
                return SEARCH_MAP[searchType] || FilterInput
            },
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
                display: inline-block;
            }

            .plain-table-filter-search-button {
                margin-left: -1px;
            }
        }
    }
</style>
