<template>
    <div class="demo-dropdown">
        <demo-row title="基本用法">
            <pl-dropdown ref="dropdown">
                <pl-button>更多</pl-button>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')"/>
                    <pl-dropdown-item label="删除" @click="$message('删除')"/>
                    <pl-dropdown-item label="导入" @click="$message('导入')"/>
                    <pl-dropdown-item label="导出" @click="$message('导出')"/>
                    <pl-dropdown-item label="筛选" @click="$message('筛选')"/>
                    <pl-dropdown-item label="排序" @click="$message('排序')"/>
                    <pl-dropdown-item label="多选" @click="$message('多选')"/>
                    <pl-dropdown-item label="设置" @click="$message('设置')"/>
                </pl-dropdown-menu>
            </pl-dropdown>
        </demo-row>
        <demo-row title="宽高设置">
            <pl-dropdown ref="sizeDropdown" width="100" height="200px">
                <pl-button>宽高设置</pl-button>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')"/>
                    <pl-dropdown-item label="删除" @click="$message('删除')"/>
                    <pl-dropdown-item label="导入" @click="$message('导入')"/>
                    <pl-dropdown-item label="导出" @click="$message('导出')"/>
                    <pl-dropdown-item label="筛选" @click="$message('筛选')"/>
                    <pl-dropdown-item label="排序" @click="$message('排序')"/>
                    <pl-dropdown-item label="多选" @click="$message('多选')"/>
                    <pl-dropdown-item label="设置" @click="$message('设置')"/>
                </pl-dropdown-menu>
            </pl-dropdown>
        </demo-row>
        <demo-row title="触发器">
            <pl-dropdown ref="sizeDropdown" width="100" height="200px" v-for="item in ['click','focus','hover']" :key="item" :trigger="item">
                <pl-button>{{item}}</pl-button>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')"/>
                    <pl-dropdown-item label="删除" @click="$message('删除')"/>
                    <pl-dropdown-item label="导入" @click="$message('导入')"/>
                    <pl-dropdown-item label="导出" @click="$message('导出')"/>
                    <pl-dropdown-item label="筛选" @click="$message('筛选')"/>
                    <pl-dropdown-item label="排序" @click="$message('排序')"/>
                    <pl-dropdown-item label="多选" @click="$message('多选')"/>
                    <pl-dropdown-item label="设置" @click="$message('设置')"/>
                </pl-dropdown-menu>
            </pl-dropdown>

            <pl-button-group>
                <pl-dropdown v-model="val[0]" trigger="manual">
                    <pl-button>manual</pl-button>
                    <pl-dropdown-menu slot="dropdown">
                        <pl-dropdown-item label="新建" @click="$message('新建')"/>
                        <pl-dropdown-item label="编辑" @click="$message('编辑')"/>
                        <pl-dropdown-item label="删除" @click="$message('删除')"/>
                        <pl-dropdown-item label="导入" @click="$message('导入')"/>
                        <pl-dropdown-item label="导出" @click="$message('导出')"/>
                        <pl-dropdown-item label="筛选" @click="$message('筛选')"/>
                        <pl-dropdown-item label="排序" @click="$message('排序')"/>
                        <pl-dropdown-item label="多选" @click="$message('多选')"/>
                        <pl-dropdown-item label="设置" @click="$message('设置')"/>
                    </pl-dropdown-menu>
                </pl-dropdown>
                <pl-button :label="'toggle==>>'+val[0]" @click="val[0] = !val[0]"/>
            </pl-button-group>
        </demo-row>
        <demo-row title="禁用选项">
            <pl-dropdown width="100" height="200px">
                <pl-button label="禁用部分选项"/>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')" disabled/>
                    <pl-dropdown-item label="删除" @click="$message('删除')"/>
                    <pl-dropdown-item label="导入" @click="$message('导入')" disabled/>
                    <pl-dropdown-item label="导出" @click="$message('导出')"/>
                    <pl-dropdown-item label="筛选" @click="$message('筛选')"/>
                    <pl-dropdown-item label="排序" @click="$message('排序')"/>
                    <pl-dropdown-item label="多选" @click="$message('多选')"/>
                    <pl-dropdown-item label="设置" @click="$message('设置')"/>
                </pl-dropdown-menu>
            </pl-dropdown>
        </demo-row>
        <demo-row title="操作图标">
            <pl-dropdown>
                <pl-button label="图标选项"/>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')" icon="el-icon-burger"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')" icon="el-icon-tableware" disabled/>
                    <pl-dropdown-item label="删除" @click="$message('删除')" icon="el-icon-sugar"/>
                    <pl-dropdown-item label="导入" @click="$message('导入')" icon="el-icon-dessert" disabled/>
                    <pl-dropdown-item label="导出所有数据" @click="$message('导出')" icon="el-icon-ice-cream"/>
                    <pl-dropdown-item label="筛选" @click="$message('筛选')" icon="el-icon-hot-water"/>
                    <pl-dropdown-item label="排序" @click="$message('排序')" icon="el-icon-water-cup"/>
                    <pl-dropdown-item label="多选" @click="$message('多选')" icon="el-icon-s-ticket"/>
                    <pl-dropdown-item label="设置" @click="$message('设置')" icon="el-icon-s-management"/>
                </pl-dropdown-menu>
            </pl-dropdown>
        </demo-row>
        <demo-row title="分组">
            <pl-dropdown>
                <pl-button label="分组选项"/>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-group label="编辑">
                        <pl-dropdown-item label="新建" @click="$message('新建')" icon="el-icon-burger"/>
                        <pl-dropdown-item label="编辑" @click="$message('编辑')" icon="el-icon-tableware" disabled/>
                        <pl-dropdown-item label="删除" @click="$message('删除')" icon="el-icon-sugar"/>
                    </pl-dropdown-group>
                    <pl-dropdown-group label="数据">
                        <pl-dropdown-item label="导入" @click="$message('导入')" icon="el-icon-dessert" disabled/>
                        <pl-dropdown-item label="导出" @click="$message('导出')" icon="el-icon-ice-cream"/>
                    </pl-dropdown-group>
                    <pl-dropdown-group label="查询">
                        <pl-dropdown-item label="筛选" @click="$message('筛选')" icon="el-icon-hot-water"/>
                        <pl-dropdown-item label="排序" @click="$message('排序')" icon="el-icon-water-cup"/>
                    </pl-dropdown-group>
                    <pl-dropdown-group label="其他">
                        <pl-dropdown-item label="多选" @click="$message('多选')" icon="el-icon-s-ticket"/>
                        <pl-dropdown-item label="设置" @click="$message('设置')" icon="el-icon-s-management"/>
                    </pl-dropdown-group>
                </pl-dropdown-menu>
            </pl-dropdown>
        </demo-row>
        <demo-row title="作用域插槽">
            <pl-dropdown ref="dropdown">
                <template slot-scope="data">
                    <pl-button>更多{{JSON.stringify(data)}}</pl-button>
                </template>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')"/>
                    <pl-dropdown-item label="删除" @click="$message('删除')"/>
                </pl-dropdown-menu>
            </pl-dropdown>
        </demo-row>
        <demo-row title="指示图标">
            <pl-dropdown ref="dropdown">
                <pl-button>
                    <span>更多</span>
                    <pl-icon icon="el-icon-arrow-down"/>
                    <pl-icon icon="el-icon-brush" class="pl-dropdown-icon"/>
                </pl-button>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')"/>
                    <pl-dropdown-item label="删除" @click="$message('删除')"/>
                </pl-dropdown-menu>
            </pl-dropdown>
            <pl-dropdown ref="dropdown">
                <span>
                    <span>更多</span>
                    <pl-icon icon="el-icon-arrow-down"/>
                    <pl-icon icon="el-icon-brush" class="pl-dropdown-icon"/>
                </span>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')"/>
                    <pl-dropdown-item label="删除" @click="$message('删除')"/>
                </pl-dropdown-menu>
            </pl-dropdown>
        </demo-row>

        <demo-row title="无容器节点">
            <pl-button-group>
                <pl-button label="新建" icon="el-icon-plus"/>
                <pl-button label="编辑" icon="el-icon-edit"/>
                <pl-button label="删除" icon="el-icon-delete"/>
                <pl-dropdown ref="dropdown">
                    <pl-button>
                        <span>更多</span>
                        <pl-icon icon="el-icon-arrow-down"/>
                    </pl-button>
                    <pl-dropdown-menu slot="dropdown">
                        <pl-dropdown-item label="高级筛选" @click="$message('高级查询')" icon="el-icon-search"/>
                        <pl-dropdown-item label="高级排序" @click="$message('高级排序')" icon="el-icon-sort"/>
                        <pl-dropdown-item label="批量删除" @click="$message('批量删除')" icon="el-icon-folder-delete"/>
                    </pl-dropdown-menu>
                </pl-dropdown>
            </pl-button-group>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-dropdown",
        props: {},
        data() {
            return {
                val: {
                    0: false,
                }
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-dropdown-show {
        font-weight: bold;
        font-style: italic;
    }
</style>