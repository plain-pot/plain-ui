<template>
    <div class="demo-toggle">
        <demo-row title="基本用法">
            <pl-toggle v-model="val[0]"/>
            <pl-toggle v-model="val[0]"/>
            {{val[0]}}
        </demo-row>
        <demo-row title="真假值">
            <pl-toggle v-model="val[1]" trueValue="Y" falseValue="N"/>
            {{val[1]}}
        </demo-row>
        <demo-row title="状态">
            <pl-toggle :modelValue="true" v-for="item in ['primary','success','warn','error','info']" :key="item" :status="item"/>
        </demo-row>
        <demo-row title="大小">
            <pl-toggle :modelValue="true" v-for="item in ['large','normal','mini']" :key="item" :size="item"/>
        </demo-row>
        <demo-row title="只读与禁用">
            <pl-checkbox v-model="val[99]" label="开关"/>
            <demo-line title="禁用">
                <pl-toggle :disabled="val[99]" :modelValue="true"/>
                <pl-toggle :disabled="val[99]"/>
            </demo-line>
            <demo-line title="只读">
                <pl-toggle :readonly="val[99]" :modelValue="true"/>
                <pl-toggle :readonly="val[99]"/>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-toggle",
        props: {},
        data() {
            return {
                val: {
                    0: true,

                    99: true
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>