<template>
    <div class="pl-input" :class="classes">
        <input
                v-model="p_value"
                :type="inputType"
                :placeholder="placeholder"
                @focus="p_focus = true"
                @blur="p_focus = false"
        >
    </div>
</template>

<script>
    export default {
        name: "pl-input",
        props: {
            value: {},

            type: {type: String, default: 'line'},
            color: {type: String, default: 'info'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},

            inputType: {type: String, default: 'text'},
            placeholder: {type: String, default: '点击输入...'},
        },
        data() {
            return {
                p_focus: false,
                p_value: this.value,
            }
        },
        computed: {
            classes() {
                return [
                    `pl-type-${this.type}`,
                    `pl-color-${this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,
                    {
                        'pl-input-focus': this.p_focus
                    },
                ]
            },
        },
    }
</script>