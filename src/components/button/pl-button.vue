<template>
    <button class="pl-button plain-click-node"
            :class="classes"
            v-click-wave="'large'"
            :type="type"
            :disabled="disabled"
            v-bind="nativeProps"
            @click="onClick">
        <pl-loading type="gamma" v-if="loading"/>
        <slot>
            <pl-icon :icon="icon" v-if="!!icon && !loading"/>
            <span v-if="!!label">{{label}}</span>
        </slot>
    </button>
</template>

<script>
    import ClickWave from "../../directives/ClickWave";

    export default {
        name: "pl-button",
        directives: {ClickWave},
        inject: {
            plButtonGroup: {default: null},
        },
        props: {
            status: {type: String, default: 'primary'},             // primary,success,warning,error,info
            mode: {type: String, default: 'fill'},                  // fill,stroke,text
            shape: {type: String, default: 'fillet'},               // fillet,round,square
            size: {type: String, default: 'default'},               // default,large,small
            label: {type: String},
            icon: {type: String},
            active: {type: Boolean},
            noPadding: {type: Boolean},
            block: {type: Boolean},
            loading: {type: Boolean},

            disabled: {type: Boolean},

            /*---------------------------------------native-------------------------------------------*/
            type: {type: String, default: 'button'},
            nativeProps: {},
        },
        data() {
            return {
                wave: false,
            }
        },
        computed: {
            targetMode() {
                return !!this.plButtonGroup ? this.plButtonGroup.mode : this.mode
            },
            targetShape() {
                return !!this.plButtonGroup ? this.plButtonGroup.shape : this.shape
            },
            targetSize() {
                return !!this.plButtonGroup ? this.plButtonGroup.size : this.size
            },
            classes() {
                return [
                    `pl-button-status-${this.status}`,
                    `pl-button-mode-${this.targetMode}`,
                    `pl-button-shape-${this.targetShape}`,
                    `pl-button-size-${this.targetSize}`,

                    {
                        'pl-button-icon': !!this.icon,
                        'pl-button-active': !!this.active,
                        'pl-button-loading': !!this.loading,
                        'pl-button-noPadding': !!this.noPadding,
                        'pl-button-wave': !!this.wave,
                        'pl-button-has-icon': !!this.icon,
                        'pl-button-block': !!this.block,
                        'pl-button-disabled': !!this.disabled,
                        'pl-button-icon-only': !!this.icon && !this.label,
                    },
                ]
            },
        },
        methods: {
            /*---------------------------------------listener-------------------------------------------*/
            onClick(e) {
                this.$emit('click', e)
            },
        },
    }
</script>

<style lang="scss">
</style>