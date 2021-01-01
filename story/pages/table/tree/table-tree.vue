<template>
    <div class="table-tree">
        <demo-row title="基本用法">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree1.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree1.collapseAll()"/>
                    <pl-button label="展开特定节点" @click="$refs.tree1.expand('2-2-2')"/>
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
                <plc-tree ref="tree1" title="标题">
                    <template v-slot:content="{row}">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="编号" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>
        <demo-row title="可选树形表格">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree2.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree2.collapseAll()"/>
                    <pl-button label="获取选中数据" @click="$message($refs.tree2.getCheckedData().map(({data})=>data.name).join(','))"/>
                </pl-button-group>
            </demo-line>
            <pl-table :data="data"
                      keyField="id"
                      childrenField="subs"
                      showCheckbox>
                <plc-index/>
                <plc-tree ref="tree2">
                    <template v-slot:content="{row}">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="编号" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
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
                    <template v-slot:content="{row}">
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
                    <pl-button @click="$message($refs.strictTree.getCheckedData().map(({data})=>data.name).join(','))">获取树列的选中数据</pl-button>
                </pl-button-group>
            </demo-line>
            <pl-table :data="data"

                      keyField="id"
                      childrenField="subs"
                      checkStrictly
                      showCheckbox>
                <plc-index/>
                <plc-check ref="strictCheck"/>
                <plc-tree ref="strictTree">
                    <template v-slot:content="{row}">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="编号" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>

        <demo-row title="多选，禁用部分选项：名称带字符【2】的记录不能选中">
            <demo-line>
                <pl-button-group>
                    <pl-button @click="$message($refs.disabledCheck.getSelected().map(node=>node.data.name).join(','))">获取多选列的选中数据</pl-button>
                    <pl-button @click="$message($refs.disabledCheckTree.getCheckedData().map(({data})=>data.name).join(','))">获取树列的选中数据</pl-button>
                </pl-button-group>
            </demo-line>
            <pl-table :data="data"

                      keyField="id"
                      childrenField="subs"
                      :isCheckable="customIsCheckable"
                      showCheckbox>
                <plc-index/>
                <plc-check ref="disabledCheck" :isCheckable="customIsCheckable"/>
                <plc-tree ref="disabledCheckTree">
                    <template v-slot:content="{row}">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="编号" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>

        <demo-row title="手风琴模式，打开节点的时候关闭兄弟节点">
            <pl-table :data="data"
                      keyField="id"
                      childrenField="subs"
                      according>
                <plc-index/>
                <plc-tree>
                    <template v-slot:content="{row}">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="编号" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>

        <demo-row title="自定义过滤函数，实现数据筛选的功能">
            <demo-line>
                <pl-alert size="mini">
                    当子节点显示的时候，父节点也会显示，不管父节点是否能通过自定义过滤函数的校验
                </pl-alert>
            </demo-line>
            <demo-line>
                <pl-input suffixIcon="el-icon-search" v-model="filterBindingText" @enter="()=>filterText = filterBindingText"/>
                <pl-icon icon="el-icon-info" v-tooltip="'回车确定筛选'"/>
            </demo-line>
            <pl-table :data="data"
                      keyField="id"
                      childrenField="subs"
                      :filterNodeMethod="customFilterNodeMethod">
                <plc-index/>
                <plc-tree>
                    <template v-slot:content="{row}">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="编号" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>

        <demo-row title="树形虚拟表格">
            <tree-table-virtual/>
        </demo-row>
        <demo-row title="可拖拽树形表格">
            <pl-table :data="data"
                      keyField="id"
                      childrenField="subs">
                <plc-index/>
                <plc-tree :rowDraggable="true">
                    <template v-slot:content="{row}">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="编号" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>
        <demo-row title="可拖拽的树形虚拟表格">
            <tree-table-virtual-draggable/>
        </demo-row>
        <demo-row title="可拖拽，可放置控制">
            <demo-line>
                <pl-alert>
                    默认情况下，一个节点不能放置在他的子节点中
                </pl-alert>
            </demo-line>
            <demo-line>
                这里示例，第一层节点不能被拖拽，不能放置在第一层节点前后，只能放置在其子节点中（相当于控制第一层节点数量不变）
            </demo-line>
            <pl-table :data="data"
                      keyField="id"
                      childrenField="subs">
                <plc-index/>
                <plc-tree :rowDraggable="true"
                          ref="draggableTree"
                          :allowRowDraggable="allow.rowDraggable"
                          :allowRowDroppable="allow.rowDroppable"
                >
                    <template v-slot:content="{row}">
                        {{row.name}}
                    </template>
                </plc-tree>
                <plc title="编号" field="id"/>
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
                log: (...args) => console.log(...args),
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
                filterText: null,
                filterBindingText: null,
                allow: {
                    rowDraggable: (node) => {
                        return node.level !== 1
                    },
                    rowDroppable: (startNode, moveNode, dropType) => {
                        if (moveNode.level !== 1) {
                            return true
                        }
                        // 这里展示了dropType的几种类型
                        switch (dropType) {
                            case 'prev':
                                return false
                            case 'next':
                                return false
                            case 'inner':
                                return true
                        }
                    }
                }
            }
        },
        methods: {
            async expandSome() {
                const keys = ['2-2-2', '3-1-2']
                await this.$refs.tree1.expand(keys)
            },
            expandAndSelect() {
                this.$refs.tree1.expand('2-2-2')
                this.$refs.table1.setCurrent('2-2-2')
            },
            customIsCheckable(node) {
                // 名称带字符【2】的记录不能选中
                return node.data.name.indexOf('2') === -1
            },
            customFilterNodeMethod(node) {
                if (!this.filterText) {
                    return true
                } else {
                    return node.data.name.indexOf(this.filterText) > -1
                }
            },
        },
        mounted() {
            // if (!!this.$refs.draggableTree) {
            //     this.$refs.draggableTree.expandAll()
            // }
        }
    }
</script>

<style lang="scss">
    .table-tree {
    }
</style>