<template>
    <div class="pl-button-group" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    import {EditMixin} from "../../utils/mixins";

    export default {
        name: "pl-button-group",
        mixins: [EditMixin],
        props: {
            mode: {type: String, default: 'fill'},                  // fill,stroke,text
            shape: {type: String, default: 'fillet'},               // fillet,round,square
            size: {type: String, default: 'default'},               // default,large,small

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
                    `pl-button-group-shape-${this.shape}`,
                    `pl-button-group-size-${this.size}`,
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