<template>
    <div class="demo-radio">
        <demo-row title="基本用法">
            <pl-radio v-model="val[0]" label="标签一"/>
            {{val[0]}}
        </demo-row>

        <demo-row title="状态">
            <pl-radio v-for="item in status" :key="item" :status="item" :label="item"/>
        </demo-row>

        <demo-row title="真假值">
            <pl-radio v-model="val[1]" label="标签一" :trueValue="10" :falseValue="20"/>
            {{val[1]}}
        </demo-row>

        <demo-row title="禁用">
            <pl-radio v-model="val[2]" label="禁用"/>
            <pl-radio label="标签一" :disabled="val[2]"/>
        </demo-row>

        <demo-row title="大小">
            <pl-radio v-for="item in sizes" :key="item" :size="item" :label="item"/>
            <pl-radio label="font-size:24px" style="font-size: 24px"/>
        </demo-row>

        <demo-row title="radio-inner">
            <pl-radio-inner status="check"/>
            <pl-radio-inner status="uncheck"/>
        </demo-row>

        <demo-row title="单选按钮组">
            <pl-radio-group v-model="val[3]">
                <pl-radio label="标签一" val="tag1"/>
                <pl-radio label="标签二" val="tag2"/>
                <pl-radio label="标签三" val="tag3"/>
            </pl-radio-group>
            {{val[3]}}
        </demo-row>
        <demo-row title="单选按钮组：状态以及大小">
            <pl-radio-group v-model="val[3]" size="large" status="error">
                <pl-radio label="标签一" val="tag1"/>
                <pl-radio label="标签二" val="tag2"/>
                <pl-radio label="标签三" val="tag3"/>
            </pl-radio-group>
            {{val[3]}}
        </demo-row>
        <demo-row title="单选按钮组：禁用以及只读">
            <pl-radio-group v-model="val[3]" disabled>
                <pl-radio label="标签一" val="tag1"/>
                <pl-radio label="标签二" val="tag2"/>
                <pl-radio label="标签三" val="tag3"/>
            </pl-radio-group>
            <br>
            <pl-radio-group v-model="val[3]" readonly>
                <pl-radio label="标签一" val="tag1"/>
                <pl-radio label="标签二" val="tag2"/>
                <pl-radio label="标签三" val="tag3"/>
            </pl-radio-group>
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