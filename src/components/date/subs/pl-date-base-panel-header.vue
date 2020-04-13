<template>
    <div class="pl-date-base-panel-header">
        <div>
            <slot name="left"/>
        </div>
        <div>
            <slot name="center"/>
        </div>
        <div>
            <slot name="right"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-date-base-panel-header",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>