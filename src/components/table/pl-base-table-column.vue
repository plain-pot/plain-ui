<template>
    <span class="pl-base-table-column" :field="field">
        <slot v-bind="slotBinding"></slot>
    </span>

</template>

<script>
    import {PublicColumnMixin, TableColumn, RefreshProps} from "./index";

    export default {
        name: "pl-base-table-column",
        mixins: [PublicColumnMixin],
        props: {
            externalProp: {type: Object},
        },
        watch: {
            ...Object.keys(PublicColumnMixin.props).reduce((ret, key) => {
                ret[key] = function (val) {
                    if (val === undefined) return
                    if (RefreshProps.indexOf(key) > -1) {
                        this.controller.pl_refresh()
                        return
                    }
                    this.p_col[key] = val
                }
                return ret
            }, {})
        },
        data() {
            return {
                p_col: null,
                p_controller: null,
            }
        },
        computed: {
            controller() {
                if (!this.p_controller) this.p_controller = this.$plain.$dom.findComponentUpward(this, 'pl-base-table-column-controller')
                return this.p_controller
            },
            slotBinding() {
                return {
                    row: null,
                    col: null,
                    rowIndex: null,
                    colIndex: null,
                }
            },
        },
        methods: {
            col() {
                this.p_col = new TableColumn(this)
                return this.p_col
            },
        },

    }
</script>