<template>
    <div class="pl-input" :class="classes">
        <input :type="inputType">
    </div>
</template>

<script>
    export default {
        name: "pl-input",
        props: {
            type: {type: String, default: 'line'},
            color: {type: String, default: 'info'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},

            inputType: {type: String, default: 'text'},
        },
        data() {
            return {}
        },
        computed: {
            classes() {
                return [
                    `pl-type-${this.type}`,
                    `pl-color-${this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,
                ]
            },
        },
    }
</script>