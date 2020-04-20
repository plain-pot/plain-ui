<template>
    <div class="demo-tab">
        <demo-row title="基本用法">
            <pl-tab-group v-model="val[0]">
                <pl-tab title="用户管理" val="user management">
                    用户管理
                </pl-tab>
                <pl-tab title="子模块数据管理" val="submodule management">
                    子模块数据管理
                </pl-tab>
                <pl-tab title="数据集" val="role management">
                    数据集
                </pl-tab>


            </pl-tab-group>
        </demo-row>

        <demo-row title="超长列表">
            <pl-tab-group>
                <pl-tab v-for="item in 40" :key="item" :title="`页签 ${item}`">
                    {{`tab ${item}`}}
                </pl-tab>
            </pl-tab-group>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-tab",
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