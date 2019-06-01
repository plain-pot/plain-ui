<template>
    <div class="pl-dropdown-item" @click.stop="pl_click">
        <div class="pl-dropdown-item-content">
            <pl-icon v-if="!!icon" :icon="icon" class="pl-dropdown-item-icon"/>
            <slot>{{label}}</slot>
        </div>
        <div class="pl-dropdown-item-line" v-if="baseLine"></div>
    </div>
</template>

<script>
    import PlButton from "../pl-button";
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-dropdown-item",
        components: {PlIcon, PlButton},
        props: {
            label: {},
            icon: {},
            disabledHideOnClick: {type: Boolean},
            baseLine: {type: Boolean},
        },
        data() {
            return {
                p_dropdown: null
            }
        },
        computed: {
            dropdown() {
                if (this.p_dropdown == null) this.p_dropdown = this.$plain.$dom.findComponentUpward(this, 'pl-dropdown')
                return this.p_dropdown
            },
        },
        methods: {
            pl_click(e) {
                this.$emit('click', e)
                if (!!this.disabledHideOnClick) return
                !!this.dropdown && this.dropdown.hide()
            },
        }
    }
</script>