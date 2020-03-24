<template>
    <div class="demo-dialog">
        <demo-row title="基本用法">
            <pl-button label="open dialog" @click="val[0] = true"/>
            <pl-dialog v-model="val[0]">
                Hello World
            </pl-dialog>
            <span>text</span>
        </demo-row>
        <demo-row title="大小">
            <pl-button label="宽高" @click="val[1] = true"/>
            <pl-dialog v-model="val[1]" width="400" height="600px">
                {{str}}
            </pl-dialog>
            <pl-button label="最小宽高" @click="val[2] = true"/>
            <pl-dialog v-model="val[2]" minWidth="300" minHeight="200px">
                Hello world
            </pl-dialog>
            <pl-button label="最大宽高" @click="val[3] = true"/>
            <pl-dialog v-model="val[3]" maxWidth="400" maxHeight="600px">
                {{str}}
            </pl-dialog>

        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";
    import data from '../data/data-1'

    const str = JSON.stringify(data, null, 2)

    export default {
        name: "demo-dialog",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {
                str,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>