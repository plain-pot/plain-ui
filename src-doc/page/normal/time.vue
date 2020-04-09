<template>
    <div class="demo-time">
        <demo-row title="time-base-column">
            <demo-row title="基本用法">
                <demo-line>
                    {{val[0]}}
                </demo-line>
                <pl-time-base-column v-model="val[0]"/>
                <pl-time-base-column v-model="val[0]"/>
            </demo-row>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-time",
        props: {},
        data() {
            return {
                val: {},
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>