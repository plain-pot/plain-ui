<template>
    <div class="plain-table-buttons">

        <div v-show="status === 'insert'">
            <pl-button label="取消" type="line" @click="pl_click('cancelInsert')" icon="pad-close"/>
            <pl-button-group>
                <pl-button label="保存" @click="pl_click('saveInsert')" icon="pad-save"/>
                <pl-button label="继续新建" @click="pl_click('continueInsert')" icon="pad-plus-circle"/>
                <pl-button label="保存并新建" @click="pl_click('nextInsert')" icon="pad-file-add"/>
            </pl-button-group>
        </div>
        <div v-show="status === 'update'">
            <pl-button label="取消" type="line" @click="pl_click('cancelUpdate')"/>
            <pl-button label="保存" @click="pl_click('saveUpdate')"/>
        </div>
        <div v-show="status === 'select'">
            <pl-button label="取消" type="line" @click="pl_click('cancelSelect')"/>
            <pl-button label="保存" @click="pl_click('confirmSelect')"/>
        </div>
        <div v-show="status === 'normal'">
            <slot></slot>
            <pl-button-group>
                <pl-button label="新建" icon="pad-plus-circle" @click="pl_click('insert')"/>
                <pl-button label="复制" icon="pad-file-copy" @click="pl_click('copy')"/>
                <pl-button label="删除" icon="pad-delete" @click="pl_click('delete')"/>
            </pl-button-group>
            <pl-dropdown :popover="{popper:{height:null,width:100,align:'end',disabledEqual:true}}">
                <pl-button label="更多" icon="pl-down" rightIcon/>
                <div slot="popper" class="plain-table-buttons-more-popper">
                    <pl-dropdown-item label="表单编辑" icon="pad-edit"/>
                    <pl-dropdown-item label="多行编辑" icon="pad-unorderedlist"/>
                    <pl-dropdown-item label="批量修改" icon="pad-edit-square"/>
                    <pl-dropdown-item label="高级筛选" icon="pad-filter"/>
                    <pl-dropdown-item label="高级排序" icon="pad-sort-ascending"/>
                    <pl-dropdown-item label="数据导出" icon="pad-export"/>
                    <pl-dropdown-item label="数据导入" icon="pad-Import"/>
                    <pl-dropdown-item label="高度设置" icon="pad-menu"/>
                    <pl-dropdown-item label="记录明细" icon="pad-detail"/>
                    <pl-dropdown-item label="记录总数" icon="pad-table1"/>
                </div>
            </pl-dropdown>
        </div>
    </div>
</template>

<script>

    export default {
        name: "plain-table-buttons",
        props: {
            status: {type: String, required: true},
            buttons: {type: Array},
        },
        methods: {
            pl_click(event) {
                this.$emit(event)
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .plain-table-buttons {
            & > div > * {
                margin-left: plVar(padding);
            }
        }

        .plain-table-buttons-more-popper {
            .pl-dropdown-item-content {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>
