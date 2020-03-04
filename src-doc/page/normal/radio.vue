<template>
    <div class="demo-radio">
        <demo-row title="基本用法">
            <pl-radio v-model="val[0]" label="标签一"/>
            {{val[0]}}
        </demo-row>

        <demo-row title="单选按钮组">
            <pl-radio-group v-model="val[3]">
                <pl-radio label="标签一" val="tag1"/>
                <pl-radio label="标签二" val="tag2"/>
                <pl-radio label="标签三" val="tag3"/>
            </pl-radio-group>
            {{val[3]}}
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "demo-radio",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>