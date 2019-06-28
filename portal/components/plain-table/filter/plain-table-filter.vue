<template>
    <div class="plain-table-filter">
        <pl-select :input="{width:120}" class="plain-table-filter-field-select plain-table-filter-clear-right-radio" :data="data" :labelKey="labelKey" :valueKey="valueKey" :value="searchField" @input="pl_changeSearchField"/>
        <div class="plain-table-filter-type plain-table-filter-clear-left-radio plain-table-filter-clear-right-radio">
            <component :is="searchType.component" :filterData="filterData[searchField]" @confirm="pl_confirm" @clear="pl_clear"/>
        </div>
        <pl-button label="查询" shape="none" class="plain-table-filter-search-button plain-table-filter-clear-left-radio" icon="pad-search" @click="pl_confirm"/>
    </div>
</template>

<script>

    import FilterInput from './item/plain-table-filter-input'
    import FilterDate from './item/plain-table-filter-date'
    import FilterNumber from './item/plain-table-filter-number'
    import FilterSelect from './item/plain-table-filter-select'
    import FilterOv from './item/plain-table-filter-ov'

    const SEARCH_MAP = {
        'input': FilterInput,
        'date': FilterDate,
        'number': FilterNumber,
        'select': FilterSelect,
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
        data() {
            return {
                filterData: {},
            }
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
                if (!this.filterData[this.searchField]) this.$set(this.filterData, this.searchField, {start: null, end: null, value: null})
                console.log('searchType', searchType)
                return {type: searchType, component: SEARCH_MAP[searchType] || FilterInput}
            },
        },
        methods: {
            pl_changeSearchField(val) {
                this.$emit('searchFieldChange', val)
            },
            async pl_confirm() {
                await this.$plain.nextTick()
                const ret = {}
                ret.field = this.searchField
                ret.type = this.searchType.type
                ret.value = this.filterData[this.searchField]
                Object.keys(this.filterData).forEach(field => field !== this.searchField && (delete this.filterData[field]))
                this.$emit('filterChange', ret)
            },
            pl_clear() {
                const ret = {}
                ret.field = this.searchField
                ret.type = this.searchType.type
                ret.value = this.filterData[this.searchField]
                Object.keys(this.filterData).forEach(field => field !== this.searchField && (delete this.filterData[field]))
                this.$emit('filterChange', ret)
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .plain-table-filter {
            display: inline-block;
            position: relative;

            & > * {
                vertical-align: top;
            }

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
