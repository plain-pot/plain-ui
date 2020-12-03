<template>
    <div class="demo-select">
        <demo-row title="SelectPanel" group>
            <demo-row title="基本测试">
                <pl-checkbox label="测试动态销毁/初始化选项，顺序是否正常" v-model="initFlag"/>
                <pl-select-panel showDebug>
                    <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                        <template v-for="item in group.children">
                            <pl-select-option :key="item.val" :label="item.name" :val="item.val" v-if="initFlag || item.name !== '岳阳市'"/>
                        </template>
                    </pl-select-group>
                </pl-select-panel>
            </demo-row>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-select",
        data() {
            return {
                initFlag: true,
                groupData: [
                    {
                        name: '广东省',
                        children: [
                            {name: '深圳市', val: 'shenzhen', i: 'el-icon-burger'},
                            {name: '广州市', val: 'guangzhou', i: 'el-icon-tableware'},
                            {name: '佛山市', val: 'foshan', i: 'el-icon-sugar'},
                            {name: '梅州市', val: 'meizhou', i: 'el-icon-dessert'},
                        ],
                    },
                    {
                        name: '湖南省',
                        children: [
                            {name: '长沙市', val: 'changsha', i: 'el-icon-ice-cream'},
                            {name: '岳阳市', val: 'yueyang', i: 'el-icon-water-cup'},
                            {name: '邵阳市', val: 'shaoyang', i: 'el-icon-watermelon'},
                        ]
                    }
                ],
            }
        },
    }
</script>

<style lang="scss">

</style>