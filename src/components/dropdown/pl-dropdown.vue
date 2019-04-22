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
    import {MountedMixin} from "../../mixin/component-mixin";

    export default {
        name: "pl-dropdown",
        mixins: [MountedMixin],
        props: {
            height: {default: '200px'},
            width: {default: '150px'},
        },
        data() {
            return {
                option: null,
                popper: null,
            }
        },
        computed: {
            popperOption() {
                if (!this.p_mounted) return {}
                return {
                    reference: this.$refs.reference,
                    popper: this.$refs.popper,
                    disabledEqual: true,
                    height: this.height,
                    width: this.width,
                    arrow: true,
                }
            },
        },
        mounted() {
            this.option = {}
        },
        methods: {
            async p_click() {
                !this.popper && (this.popper = await this.$plain.$popper.getPopper(this.popperOption))
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
            display: inline-flex;
            flex-direction: column;
            box-sizing: border-box;
            height: 100%;
            width: 100%;
            padding: 12px;
        }
    }
</style>