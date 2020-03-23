<template>
    <div class="pl-dropdown-item" @click="onClick" :class="{'pl-dropdown-item-disabled':disabled}">
        <pl-icon :icon="icon" v-if="!!icon"/>
        <slot>{{p_label}}</slot>
    </div>
</template>

<script>
    import {EmitMixin, PropsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-dropdown-item",
        inject: {
            plDropdownWrapper: {default: null}
        },
        mixins: [
            EmitMixin,
            PropsMixinFactory.create({
                label: PropsMixinFactory.Promise,
            }),
        ],
        emitters: {
            emitClick: Function,
        },
        props: {
            label: {type: [String, Object]},
            icon: {type: String},
            disabled: {type: Boolean}
        },
        data() {
            return {}
        },
        methods: {
            onClick(e) {
                if (!this.disabled) {
                    this.emitClick(e)
                    this.plDropdownWrapper.onClickItem(this)
                }
            },
        },
    }
</script>

<style lang="scss">
</style>