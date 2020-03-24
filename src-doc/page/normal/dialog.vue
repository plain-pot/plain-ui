<template>
    <div class="demo-dialog">
        <demo-row title="基本用法">
            <pl-button label="open dialog" @click="val[0] = true"/>
            <pl-dialog v-model="val[0]">
                Hello World
            </pl-dialog>
            <span>text</span>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-dialog",
        props: {},
        data() {
            return {
                val: {
                    0: true,
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>