<template>
    <div class="pl-button-group" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    import {EditMixin, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-button-group",
        mixins: [EditMixin, StyleMixin],
        props: {
            mode: {type: String, default: 'fill'},                  // fill,stroke,text

            vertical: {type: Boolean},
        },
        provide() {
            return {
                plButtonGroup: this,
            }
        },
        data() {
            return {}
        },
        computed: {
            classes() {
                return [
                    `pl-button-group-status-${this.status}`,
                    `pl-button-group-mode-${this.mode}`,
                    `pl-button-group-shape-${this.p_shape || 'fillet'}`,
                    `pl-button-group-size-${this.p_size || 'normal'}`,
                    `pl-button-group-direction-${this.vertical ? 'vertical' : 'horizontal'}`,
                    {
                        'pl-button-group-disabled': !!this.isDisabled,
                    },
                ]
            },
        },
        methods: {},
    }
</script>