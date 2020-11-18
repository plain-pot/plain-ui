<template>
    <div class="demo-dropdown">
        <demo-row title="基本用法">
            <pl-dropdown>
                <pl-button>Dropdown</pl-button>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                        <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                        <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                        <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                        <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                        <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                        <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                        <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>
            旁边的文本(证明Dropdown为无根组件)
        </demo-row>
        <demo-row title="宽高设置">
            <pl-dropdown height="150">
                <pl-button>Dropdown</pl-button>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                        <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                        <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                        <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                        <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                        <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                        <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                        <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>
        </demo-row>

        <demo-row title="触发器">
            <pl-button-group>
                <pl-dropdown v-for="item in ['click','focus','hover']" :key="item" :trigger="item">
                    <pl-button>{{item}}</pl-button>
                    <template #popper>
                        <pl-dropdown-menu>
                            <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                            <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                            <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                            <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                            <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                            <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                            <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                            <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                        </pl-dropdown-menu>
                    </template>
                </pl-dropdown>
            </pl-button-group>
            <pl-button-group>
                <pl-dropdown v-model="val[0]" trigger="manual">
                    <pl-button>manual</pl-button>
                    <template #popper>
                        <pl-dropdown-menu>
                            <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                            <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                            <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                            <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                            <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                            <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                            <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                            <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                        </pl-dropdown-menu>
                    </template>
                </pl-dropdown>
                <pl-button :label="`点击：${val[0]?'关闭':'展开'}`" @click="val[0] = !val[0]"/>
            </pl-button-group>
        </demo-row>

        <demo-row title="禁用选项">
            <pl-dropdown>
                <pl-button>Dropdown</pl-button>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                        <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')" disabled/>
                        <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                        <pl-dropdown-option label="导入 Import" @click="$message('导入')" disabled/>
                        <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                        <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')" disabled/>
                        <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                        <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>
        </demo-row>

        <demo-row title="选项图标">
            <pl-dropdown>
                <pl-button>Dropdown</pl-button>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" @click="$message('新建')" icon="el-icon-document-add"/>
                        <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')" disabled icon="el-icon-document"/>
                        <pl-dropdown-option label="删除 Delete" @click="$message('删除')" icon="el-icon-document-remove"/>
                        <pl-dropdown-option label="导入 Import" @click="$message('导入')" disabled icon="el-icon-download"/>
                        <pl-dropdown-option label="导出 Export" @click="$message('导出')" icon="el-icon-upload1"/>
                        <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')" disabled icon="el-icon-crop"/>
                        <pl-dropdown-option label="排序 Sort" @click="$message('排序')" icon="el-icon-s-fold"/>
                        <pl-dropdown-option label="多选 Select" @click="$message('多选')" icon="el-icon-folder-opened"/>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>
        </demo-row>

        <demo-row title="选项分组">
            <pl-dropdown>
                <pl-button>Dropdown</pl-button>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-group title="编辑">
                            <pl-dropdown-option label="新建 Create" @click="$message('新建')" icon="el-icon-document-add"/>
                            <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')" disabled icon="el-icon-document"/>
                            <pl-dropdown-option label="删除 Delete" @click="$message('删除')" icon="el-icon-document-remove"/>
                        </pl-dropdown-group>
                        <pl-dropdown-group title="数据">
                            <pl-dropdown-option label="导入 Import" @click="$message('导入')" disabled icon="el-icon-download"/>
                            <pl-dropdown-option label="导出 Export" @click="$message('导出')" icon="el-icon-upload1"/>
                        </pl-dropdown-group>
                        <pl-dropdown-group title="搜索">
                            <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')" disabled icon="el-icon-crop"/>
                            <pl-dropdown-option label="排序 Sort" @click="$message('排序')" icon="el-icon-s-fold"/>
                        </pl-dropdown-group>
                        <pl-dropdown-group title="其他">
                            <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                            <pl-dropdown-option label="设置 Config" @click="$message('多选')"/>
                        </pl-dropdown-group>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>

            <pl-dropdown height="200">
                <pl-button>Dropdown(固定高度)</pl-button>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-group title="编辑">
                            <pl-dropdown-option label="新建 Create" @click="$message('新建')" icon="el-icon-document-add"/>
                            <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')" disabled icon="el-icon-document"/>
                            <pl-dropdown-option label="删除 Delete" @click="$message('删除')" icon="el-icon-document-remove"/>
                        </pl-dropdown-group>
                        <pl-dropdown-group title="数据">
                            <pl-dropdown-option label="导入 Import" @click="$message('导入')" disabled icon="el-icon-download"/>
                            <pl-dropdown-option label="导出 Export" @click="$message('导出')" icon="el-icon-upload1"/>
                        </pl-dropdown-group>
                        <pl-dropdown-group title="搜索">
                            <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')" disabled icon="el-icon-crop"/>
                            <pl-dropdown-option label="排序 Sort" @click="$message('排序')" icon="el-icon-s-fold"/>
                        </pl-dropdown-group>
                        <pl-dropdown-group title="其他">
                            <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                            <pl-dropdown-option label="设置 Config" @click="$message('多选')"/>
                        </pl-dropdown-group>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>
        </demo-row>

        <demo-row title="指示图标">
            <pl-dropdown>
                <template v-slot:reference="{open}">
                    <pl-button>
                        <span>切换图标</span>
                        <pl-icon :icon="open?'el-icon-arrow-up':'el-icon-arrow-down'"/>
                    </pl-button>
                </template>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                        <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                        <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                        <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                        <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                        <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                        <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                        <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>
            <pl-dropdown>
                <template v-slot:reference="{open}">
                    <pl-button>
                        <span>图表旋转过渡</span>
                        <pl-icon icon="el-icon-arrow-down" :style="`transition:transform 200ms linear; transform: rotate(${open?180:0}deg)`"/>
                    </pl-button>
                </template>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                        <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                        <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                        <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                        <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                        <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                        <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                        <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>

            <pl-button-group>
                <pl-button label="搭配按钮组" @click="$message('搭配按钮组')"/>
                <pl-dropdown placement="bottom-end">
                    <template v-slot:reference="{open}">
                        <pl-button :icon="open?'el-icon-arrow-up':'el-icon-arrow-down'"/>
                    </template>
                    <template #popper>
                        <pl-dropdown-menu>
                            <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                            <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                            <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                            <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                            <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                            <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                            <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                            <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                        </pl-dropdown-menu>
                    </template>
                </pl-dropdown>
            </pl-button-group>

            <pl-dropdown>
                <template v-slot:reference="{open}">
                    <span>
                        任意内容
                        <pl-icon :icon="open?'el-icon-arrow-up':'el-icon-arrow-down'"/>
                    </span>
                </template>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                        <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                        <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                        <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                        <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                        <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                        <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                        <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "dropdown",
        data() {
            return {
                val: {
                    0: false
                },
            }
        },
    }
</script>

<style lang="scss">

</style>