<template>
    <div class="table-tree">
        <demo-row title="基本用法">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree1.treePlc.methods.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree1.treePlc.methods.collapseAll()"/>
                    <pl-button label="展开特定节点" @click="$refs.tree1.treePlc.methods.expand('2-2-2')"/>
                    <pl-button label="展开部分节点" @click="expandSome"/>
                    <!--                    <pl-button label="当前选中节点" @click="showCurrent"/>-->
                    <pl-button label="展开并且设置当前选中节点" @click="expandAndSelect"/>
                </pl-button-group>
            </demo-line>
            <pl-table :data="data"
                      keyField="id"
                      childrenField="subs"
                      ref="table1">
                <plc-index/>
                <plc-tree ref="tree1">
                    <template slot-scope="{row}" slot="content">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="名称" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>
        <demo-row title="可选树形表格">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree2.treePlc.methods.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree2.treePlc.methods.collapseAll()"/>
                    <pl-button label="获取选中数据" @click="$message($refs.tree2.treePlc.methods.getCheckedData().map(item=>item.name).join(','))"/>
                </pl-button-group>
            </demo-line>
            <pl-table :data="data"
                      keyField="id"
                      childrenField="subs">
                <plc-index/>
                <plc-tree ref="tree2" showCheckbox>
                    <template slot-scope="{row}" slot="content">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="名称" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>
        <demo-row title="树形虚拟表格">
            <tree-table-virtual/>
        </demo-row>
        <demo-row title="可拖拽树形表格">

            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.draggableTree.treePlc.methods.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.draggableTree.treePlc.methods.collapseAll()"/>
                </pl-button-group>
            </demo-line>

            <pl-table :data="data"
                      keyField="id"
                      childrenField="subs">
                <plc-index/>
                <plc-tree rowDraggable ref="draggableTree">
                    <template slot-scope="{row}" slot="content">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="名称" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>

        <demo-row title="可拖拽的树形虚拟表格">
            <tree-table-virtual-draggable/>
        </demo-row>

        <demo-row title="懒加载子节点">
            <pl-table v-model="lazyDemo.data"
                      keyField="id"
                      childrenField="subs"
                      lazy
                      :isLeaf="lazyDemo.isLeaf"
                      :getChildren="lazyDemo.getChildren">
                <plc-index/>
                <plc-tree ref="draggableTree">
                    <template slot-scope="{row}" slot="content">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="编号" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>

        <demo-row title="多选，父子互不关联">
            <demo-line>
                <pl-button-group>
                    <pl-button @click="$message($refs.strictCheck.getSelected().map(node=>node.data.name).join(','))">获取多选列的选中数据</pl-button>
                    <pl-button @click="$message($refs.strictTree.treePlc.methods.getCheckedData().map(item=>item.name).join(','))">获取树列的选中数据</pl-button>
                </pl-button-group>
            </demo-line>
            <pl-table :data="data"

                      keyField="id"
                      childrenField="subs"
                      checkStrictly>
                <plc-index/>
                <plc-check ref="strictCheck"/>
                <plc-tree ref="strictTree" showCheckbox>
                    <template slot-scope="{row}" slot="content">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="名称" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>

        <demo-row title="多选，禁用部分选项：名称带字符【2】的记录不能选中">
            <demo-line>
                <pl-button-group>
                    <pl-button @click="$message($refs.disabledCheck.getSelected().map(node=>node.data.name).join(','))">获取多选列的选中数据</pl-button>
                    <pl-button @click="$message($refs.disabledCheckTree.treePlc.methods.getCheckedData().map(item=>item.name).join(','))">获取树列的选中数据</pl-button>
                </pl-button-group>
            </demo-line>
            <pl-table :data="data"

                      keyField="id"
                      childrenField="subs"
                      :isCheckable="customIsCheckable">
                <plc-index/>
                <plc-check ref="disabledCheck" :isCheckable="customIsCheckable"/>
                <plc-tree ref="disabledCheckTree" showCheckbox>
                    <template slot-scope="{row}" slot="content">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="名称" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>

    </div>
</template>

<script>

    import data from '../../data/tree.data'
    import TreeTableVirtual from "./tree-table-virtual";
    import TreeTableVirtualDraggable from "./tree-table-virtual-draggable";

    export default {
        name: "table-tree",
        components: {TreeTableVirtualDraggable, TreeTableVirtual},
        data() {
            return {
                data,
                lazyDemo: {
                    data: [],
                    isLeaf: (node) => {
                        return node.level >= 3
                    },
                    getChildren: (node, resolve) => {
                        switch (node.level) {
                            case 0:
                                // 加载一级数据
                                this.lazyDemo.getCitiesByParentId(null).then(resolve)
                                break
                            case 1:
                                // 加载二级数据
                                this.lazyDemo.getCitiesByParentId(node.data.id).then(resolve)
                                break
                            case 2:
                                // 加载三级数据
                                this.lazyDemo.getCitiesByParentId(node.data.id).then(resolve)
                                break
                            default:
                                return null
                        }
                    },
                    getCitiesByParentId(parentId) {
                        return new Promise((resolve) => {
                            // 这个是模拟在数据库表中的数据
                            const data = [
                                {id: '1', name: '广东省', parentId: null, subs: []},
                                {id: '2', name: '佛山市', parentId: '1', subs: []},
                                {id: '3', name: '深圳市', parentId: '1', subs: []},
                                {id: '4', name: '禅城区', parentId: '2', subs: []},
                                {id: '5', name: '南山区', parentId: '3', subs: []},

                                {id: '6', name: '湖南省', parentId: null, subs: []},
                                {id: '7', name: '长沙市', parentId: '6', subs: []},
                                {id: '8', name: '邵阳市', parentId: '6', subs: []},
                                {id: '9', name: '天心区', parentId: '7', subs: []},

                                {id: '11', name: '陕西省', parentId: null, subs: []},
                            ]

                            // 模拟请求，请求时间大概在1s-2s之间
                            setTimeout(() => {
                                resolve(data.filter(item => item.parentId === parentId))
                            }, Math.random() * 1000 + 1000)
                        })
                    },
                },
            }
        },
        methods: {
            async expandSome() {
                const keys = ['2-2-2', '3-1-2']
                await this.$refs.tree1.treePlc.methods.expand(keys)
            },
            expandAndSelect() {
                this.$refs.tree1.treePlc.methods.expand('2-2-2')
                this.$refs.table1.methods.setCurrent('2-2-2')
            },
            customIsCheckable(node) {
                // 名称带字符【2】的记录不能选中
                return node.data.name.indexOf('2') === -1
            },
        },
        mounted() {
            if (!!this.$refs.draggableTree) {
                this.$refs.draggableTree.treePlc.methods.expandAll()
            }
        }
    }
</script>

<style lang="scss">
    .table-tree {
    }
</style>