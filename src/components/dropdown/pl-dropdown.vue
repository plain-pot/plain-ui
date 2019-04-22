<template>
    <div class="pl-dropdown">
        <div class="pl-dropdown-reference" @click="p_click" ref="reference">
            <slot></slot>
        </div>
        <div class="pl-dropdown-popper-wrapper">
            <div class="pl-dropdown-popper" ref="popper">
                <slot name="popper"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-dropdown",
        data() {
            return {
                option: null,
                popper: null,
            }
        },
        mounted() {
            this.option = {
                reference: this.$refs.reference,
                popper: this.$refs.popper,
                disabledEqual: true,
                // height:null,
                // width:null,
                arrow:true,
            }
        },
        methods: {
            async p_click() {
                !this.popper && (this.popper = await this.$plain.$popper.getPopper(this.option))
                this.popper.p_show ? this.popper.hide() : this.popper.show()
            },
        },
    }
</script>

<style lang="scss">
    .pl-dropdown {
        .pl-dropdown-popper-wrapper {
            display: none;
        }
        @at-root .pl-dropdown-popper {
            display: inline-block;
        }
    }
</style>