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
                    v-bind="popoverBinding">
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
        },
        data() {
            return {
                p_popover: null,
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
        mounted() {
            this.p_popover = this.$refs.popover
        },
        methods: {
            show() {
                this.p_popover.show()
            },
            hide() {
                this.p_popover.hide()
            },
            async p_click() {
                if (!!this.p_popover.p_popper.p_value) {
                    this.p_popover.hide()
                } else {
                    this.p_popover.show()
                }
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-dropdown {
            .pl-dropdown-popper-wrapper {
                display: none;
            }
        }
        .pl-dropdown-popper {
            display: inline-flex;
            flex-direction: column;
            box-sizing: border-box;
            height: 100%;
            width: 100%;
            padding: 3px 3px;

            .pl-dropdown-item {
                .pl-dropdown-item-content {
                    padding: 6px 6px;
                    font-size: 12px;
                    color: plVar(colorContent);
                    border-radius: plVar(borderFillet);

                    &:hover {
                        cursor: pointer;
                        background-color: plVar(colorPrimaryLighter);
                        color: plVar(colorPrimaryDeep);
                    }

                    .pl-dropdown-item-icon {
                        margin-right: 6px;
                    }
                }
            }
        }
    }
</style>