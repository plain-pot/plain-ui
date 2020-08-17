<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="pl-checkbox-inner" :class="classes">
        <polyline points="22,50 45,75 75,25" v-if="status === 'check'" class="pl-checkbox-inner-check-polyline"/>
        <rect v-if="status === 'minus'" x="20" y="20" width="60" height="60" class="pl-checkbox-inner-minus-polyline"/>
    </svg>
</template>

<script>
    export default {
        name: "pl-checkbox-inner",
        props: {
            disabled: {type: Boolean},
            status: {default: 'check'},                             // check,uncheck,minus
        },
        data() {
            return {}
        },
        computed: {
            classes() {
                return [
                    `pl-checkbox-inner-status-${this.status}`,
                    {
                        'pl-checkbox-inner-disabled': this.disabled,
                    }
                ]
            },
        },
    }
</script>