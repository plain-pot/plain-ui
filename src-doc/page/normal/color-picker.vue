<template>
    <div class="color-picker">
        <demo-row title="基本用法">
            <demo-line>
                color:{{color}}
            </demo-line>
            <demo-line>
                <pl-color-panel v-model="color" enableAlpha format="hex"/>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "color-picker",
        props: {},
        data() {
            return {
                color: '#218379',
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>