<template>
    <div class="demo-tab">
        <demo-row title="基本用法">
            <!--<demo-line label="show tab2">
                <pl-checkbox v-model="showFlag"/>
            </demo-line>-->
            <pl-tab-group v-model="val[0]">
                <pl-tab title="用户管理" val="user management">
                    用户管理
                    <input type="text">
                </pl-tab>
                <pl-tab title="子模块数据管理" val="submodule management" v-if="showFlag">
                    子模块数据管理
                    <input type="text">
                </pl-tab>
                <pl-tab title="数据集" val="role management">
                    数据集
                    <input type="text">
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
        <demo-row title="三种样式">
            <pl-tab-group v-for="item in ['text','card','fillet']" :key="item" :headType="item">
                <pl-tab title="用户管理" val="user management">用户管理</pl-tab>
                <pl-tab title="子模块数据管理" val="submodule management">子模块数据管理</pl-tab>
                <pl-tab title="数据集" val="role management">数据集</pl-tab>
            </pl-tab-group>
        </demo-row>

        <demo-row title="选项卡位置">
            <demo-line title="位置">
                <pl-button-group>
                    <pl-button v-for="item in positions" :key="item" :label="item" :active="position === item" @click="position = item"/>
                </pl-button-group>
            </demo-line>
            <demo-line title="样式">
                <pl-button-group>
                    <pl-button v-for="item in types" :key="item" :label="item" :active="type === item" @click="type = item"/>
                </pl-button-group>
            </demo-line>
            <demo-line>
                <pl-checkbox label="显示关闭图标" v-model="showClose"/>
            </demo-line>
            <pl-tab-group style="height:300px" :headPosition="position" :key="`${position}-${type}`" :headType="type" :closeIcon="showClose">
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
            <pl-tab-group style="height:300px" :headPosition="position" :key="`${position}-${type}`" :headType="type" :closeIcon="showClose">
                <pl-tab v-for="item in 40" :key="item" :title="`页签 ${item}`">
                    {{`tab ${item}`}}
                </pl-tab>
            </pl-tab-group>
        </demo-row>

        <demo-row title="动态增删标签">
            <demo-line title="操作按钮">
                <pl-button-group>
                    <pl-button label="add" @click="counts.push(record++)"/>
                    <pl-button label="minus" @click="counts.shift()"/>
                </pl-button-group>
                <pl-toggle v-model="show"/>
            </demo-line>
            <pl-tab-group closeIcon @close="onClose">
                <pl-tab v-for="item in counts" :key="item" :title="`页签 ${item}`" :val="item">
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
                positions: ['top', 'bottom', 'left', 'right'],
                types: ['text', 'card', 'fillet'],

                position: 'top',
                type: 'text',

                val: {},

                counts: [1, 2, 3],
                record: 4,

                showClose: false,
                show: true,
                showFlag: true,
            }
        },
        methods: {
            onClose(item, index) {
                this.counts.splice(index, 1)
            },
        },
    }
</script>

<style lang="scss">
</style>