<template>
    <div class="step">
        <demo-row title="基本用法">
            <demo-line>
                <pl-toggle v-model="val[0]"/>
            </demo-line>
            <pl-step-group>
                <pl-step icon="el-icon-s-promotion" title="步骤一"/>
                <pl-step icon="el-icon-s-flag" title="步骤二"/>
                <pl-step icon="el-icon-s-finance" title="步骤三" v-if="val[0]"/>
                <pl-step icon="el-icon-s-platform" title="步骤四"/>
            </pl-step-group>
        </demo-row>
    </div>
</template>

<script>

    export default {
        name: "step",
        data() {
            return {
                val: {
                    0: true
                }
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>