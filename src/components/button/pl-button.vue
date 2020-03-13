<template>
    <button class="pl-button plain-click-node"
            :class="classes"
            v-click-wave="'large'"
            :type="type"
            :disabled="isDisabled"
            :readonly="isReadonly"
            v-bind="nativeProps"
            @click="onClick">
        <pl-loading type="gamma" v-if="loading"/>
        <slot>
            <pl-icon :icon="icon" v-if="!!icon && !loading"/>
            <span v-if="!!p_label">{{p_label}}</span>
        </slot>
    </button>
</template>

<script>
    import ClickWave from "../../directives/ClickWave";
    import {EditMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-button",
        directives: {ClickWave},
        mixins: [
            EditMixin,
            StyleMixin,
            PropsMixinFactory({
                label: PropsMixinFactory.Promise,
            })
        ],
        inject: {
            plButtonGroup: {default: null},
        },
        props: {
            status: {type: String, default: 'primary'},             // primary,success,warning,error,info
            mode: {type: String, default: 'fill'},                  // fill,stroke,text
            label: {type: String},

            icon: {type: String},
            active: {type: Boolean},
            noPadding: {type: Boolean},
            block: {type: Boolean},
            loading: {type: Boolean},

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
            classes() {
                return [
                    `pl-button-status-${this.status}`,
                    `pl-button-mode-${this.targetMode}`,
                    `pl-button-shape-${this.p_shape || 'fillet'}`,
                    `pl-button-size-${this.p_size || 'default'}`,

                    {
                        'pl-button-icon': !!this.icon,
                        'pl-button-active': !!this.active,
                        'pl-button-loading': !!this.loading,
                        'pl-button-noPadding': !!this.noPadding,
                        'pl-button-wave': !!this.wave,
                        'pl-button-has-icon': !!this.icon,
                        'pl-button-block': !!this.block,
                        'pl-button-disabled': !!this.isDisabled,
                        'pl-button-icon-only': !!this.icon && !this.p_label,
                    },
                ]
            },
        },
        methods: {
            /*---------------------------------------listener-------------------------------------------*/
            onClick(e) {
                if (this.isEditable) {
                    this.$emit('click', e)
                }
            },
        },
    }
</script>

<style lang="scss">
</style>