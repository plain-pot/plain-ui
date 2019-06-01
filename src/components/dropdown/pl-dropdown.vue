<template>
    <div class="pl-dropdown">
        <div ref="reference"
             class="pl-dropdown-reference"
             @click="p_click"
        >
            <slot></slot>
        </div>
        <pl-popover ref="popover"
                    :reference="!p_mounted?null:$refs.reference"
                    v-bind="popoverBinding"
                    v-if="p_init">
            <div class="pl-dropdown-popper" ref="popper">
                <slot name="popper"></slot>
            </div>
        </pl-popover>
    </div>
</template>

<script>
    import {MountedMixin} from "../../mixin/component-mixin";
    import PlPopover from "../popper/pl-popover";

    export default {
        name: "pl-dropdown",
        components: {PlPopover},
        mixins: [MountedMixin],
        props: {
            popover: {},
            init: {type: Boolean},
        },
        data() {
            return {
                p_popover: null,
                p_init: this.init,
            }
        },
        computed: {
            popoverBinding() {
                return Object.assign({
                    popper: {
                        arrow: true,
                        disabledEqual: true,
                        height: '200px',
                        width: '150px',
                    },
                }, this.popover)
            },
        },
        methods: {
            async show() {
                this.p_popover.show()
            },
            hide() {
                this.p_popover.hide()
            },
            async p_click() {
                if (!this.p_init) {
                    this.p_init = true
                    await this.$plain.nextTick()
                    this.p_popover = this.$refs.popover
                }

                if (!!this.p_popover.p_popper.p_value) {
                    this.p_popover.hide()
                } else {
                    this.p_popover.show()
                }
            },
        },
    }
</script>