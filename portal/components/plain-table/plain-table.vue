<template>
    <div class="plain-table">
        <div class="plain-table-head">
            <plain-table-filter/>
            <plain-table-buttons @insert="newInsert"
                                 @continueInsert="newInsert"
                                 @cancelInsert="cancel"
                                 @saveInsert="save"
                                 @cancelUpdate="cancel"
                                 @saveUpdate="save"
                                 @delete="pl_startDelete"

                                 :status="status"
                                 :buttons="buttons">
                <slot name="button"></slot>
            </plain-table-buttons>
        </div>
        <pl-base-table ref="table" id="id"
                       :data="option.list"
                       :page="option.page"
                       :pageSize="option.pageSize"
                       :showNum="option.showNum"
                       :sortField="option.sortField"
                       :sortDesc="option.sortDesc"
                       @sortChange="option.changeSort"
                       @selectRow="pl_selectRow"
                       @dblclickRow="pl_dblClickRow">
            <slot></slot>
        </pl-base-table>
        <div class="plain-table-foot">
            <pl-pagination :page="option.page"
                           :size="option.pageSize"
                           :sizeData="option.pageOption"
                           :total="option.total"
                           :loading="option.loading"
                           @prev="option.prevPage"
                           @next="option.nextPage"
                           @jump="option.jumpPage"
                           @refresh="option.jumpPage"
                           @sizeChange="option.changePageSize">
                <template slot="right" slot-scope="{start,end}">
                    <span>当前显示：{{start}}-{{end}}</span>,
                    共
                    <span :class="{'plain-table-pagination-no-more':!option.noMore}" @click="option.queryCount">
                        <span>{{option.showTotal}}</span>
                    </span>
                    条记录
                    <span v-if="option.totalPage !=null">
                        ,共 {{option.totalPage}} 页
                    </span>
                </template>
            </pl-pagination>
        </div>
    </div>
</template>

<script>
    import PlainOption from "./plain-option";
    import PlainTableFilter from "./filter/plain-table-filter";
    import PlainTableButtons from "./components/plain-table-buttons.vue";
    import {StandardButtons} from "./components/plain-table-buttons.js";

    export default {
        name: "plain-table",
        components: {PlainTableButtons, PlainTableFilter},
        props: {
            option: {require: true, type: PlainOption},
        },
        data() {
            const EDIT_STATUS = {
                normal: 'normal',
                insert: 'insert',
                update: 'update',
                select: 'select',
            }
            const p_allStatus = Object.keys(EDIT_STATUS)
            return {
                EDIT_STATUS,
                status: EDIT_STATUS.normal,
                p_allStatus,
                p_newRows: [],
                table: null,
                pl_keydown: null,
            }
        },
        created() {
            this.option.pl_loadDefaultOption()
            !!this.option.loadOnStart && this.option.reload()
        },
        mounted() {
            this.table = this.$refs.table
            this.option.table = this
            this.pl_initKeyboard()
        },
        computed: {
            buttons() {
                const standardButtons = this.$plain.$utils.deepCopy(StandardButtons)
                const optionButtons = this.option.buttons || {}
                const allButtonNames = Array.from(new Set(Object.keys(standardButtons).concat(Object.keys(optionButtons))))
                const buttons = []
                allButtonNames.forEach(name => {
                    let sb = standardButtons[name]
                    let ob = optionButtons[name]
                    let btn;
                    if (ob === false) return
                    if ((ob === true || ob == null) && !!sb) {
                        sb.standard = true
                        btn = sb
                    } else {
                        if (!sb) {
                            btn = ob
                        } else {
                            btn = this.$plain.$utils.deepmerge(sb, ob)
                        }
                    }
                    if (!!btn) {
                        const oldHandler = btn.handler
                        btn.handler = (e) => {
                            const display = btn.display == null ? true : this.$plain.$utils.typeOf(btn.display) === 'function' ? btn.display.apply(this.option.context) : !!btn.display
                            const disabled = btn.disabled == null ? false : this.$plain.$utils.typeOf(btn.disabled) === 'function' ? btn.disabled.apply(this.option.context) : !!btn.disabled
                            !!display && !disabled && !!oldHandler && (e.returnValue = oldHandler.apply(!!btn.standard ? this : this.option.context, [e]))
                        }
                        buttons.push(btn)
                    }
                })
                return buttons
            },
            keydownListener() {
                const buttonMap = this.buttons.reduce((ret, item) => {
                    if (!item.key) return ret
                    ret[item.key] = item.handler
                    return ret
                }, {})
                return {
                    ...buttonMap,
                    Enter: () => {
                        console.log('enter')
                    },
                    Escape: () => {
                        this.cancel()
                    },
                    'ctrl+a': (e) => {
                        if (e.target.tagName !== 'DIV') return true
                        console.log(e)
                        console.log('ctrl+a')
                    },
                    'ctrl+s': (e) => {
                        this.save()
                    }
                }
            },
        },
        methods: {
            /**
             * 根据状态执行操作
             * @author  韦胜健
             * @date    2019/6/23 16:27
             */
            async checkStatus(option) {
                if (!!option[this.status]) await option[this.status].apply(this)
                !!option.final && await option.final.apply(this)
            },
            /**
             * 修改当前表格状态
             * @author  韦胜健
             * @date    2019/6/23 16:27
             */
            async changeStatus(status) {
                if (this.p_allStatus.indexOf(status) === -1) {
                    throw new Error(`status[${status}] is illegal!`)
                }
                this.status = status
            },
            /**
             * 新建一行数据
             * @author  韦胜健
             * @date    2019/6/23 11:39
             */
            async newInsert() {
                await this.$plain.nextTick()

                const newRow = {
                    id: 'uuid' + this.$plain.$utils.uuid(),
                }
                this.p_newRows.unshift(newRow)
                this.option.list.unshift(newRow)
                await this.$plain.nextTick()
                this.table.enableEdit({index: 0})
                this.changeStatus(this.EDIT_STATUS.insert)
            },
            /**
             * 取消
             * @author  韦胜健
             * @date    2019/6/23 16:19
             */
            async cancel() {
                this.checkStatus({
                    insert() {
                        while (this.p_newRows.length > 0) {
                            this.p_newRows.shift()
                            this.option.list.shift()
                        }
                    },
                    update() {
                        this.table.cancelEdit()
                        this.table.disableEdit()
                    },
                    select() {

                    },
                    final() {
                        this.changeStatus(this.EDIT_STATUS.normal)
                    },
                })
            },
            /**
             * 保存修改
             * @author  韦胜健
             * @date    2019/6/23 16:28
             */
            async save() {
                this.checkStatus({
                    async insert() {
                        const editDataArray = await this.table.getEditData()
                        if (editDataArray.length === 0) {
                            throw new Error('no edit data!')
                        }
                        if (editDataArray.length === 1) {
                            await this.pl_insert(editDataArray[0])
                        } else {
                            await this.pl_batchInsert(editDataArray)
                            this.$nextTick(() => this.option.load())
                        }
                        this.p_newRows.splice(0, this.p_newRows.length)
                    },
                    async update() {
                        const editDataArray = await this.table.getEditData()
                        if (editDataArray.length === 0) {
                            throw new Error('no edit data!')
                        }
                        if (editDataArray.length === 1) {
                            await this.pl_update(editDataArray[0])
                        } else {
                            await this.pl_batchUpdate(editDataArray)
                        }
                    },
                    async select() {

                    },
                    async final() {
                        this.changeStatus(this.EDIT_STATUS.normal)
                    },
                })
            },
            /**
             * 选中一行数据
             * @author  韦胜健
             * @date    2019/6/23 17:51
             */
            selectRow({id, index}) {
                return this.table.selectRow({id, index})
            },
            /**
             * （多选复选框）选中一行数据
             * @author  韦胜健
             * @date    2019/6/23 17:52
             */
            checkRow({id, index}) {
                return this.table.checkRow({id, index})
            },
            /**
             * （多选复选框）取消选中一行数据
             * @author  韦胜健
             * @date    2019/6/23 17:52
             */
            uncheckRow({id, index}) {
                return this.table.uncheckRow({id, index})
            },
            /**
             * 删除一行数据
             * @author  韦胜健
             * @date    2019/6/23 21:03
             */
            delete(index) {
                if (index == null) {
                    const deleteDataRow = this.option.selectDataRow
                    if (!deleteDataRow) {
                        const msg = '请选择要删除的一行数据！'
                        this.$dialog.show(msg, {type: 'error'})
                        return Promise.reject(msg)
                    } else {
                        index = deleteDataRow.index
                    }
                }
                this.$dialog.show(`确定要删除第${(this.option.page - 1) * this.option.pageSize + index + 1}条数据吗？`, {
                    confirmButton: true,
                    cancelButton: true,
                    onConfirm: () => {
                        this.pl_delete(index)
                    }
                })
            },

            /*---------------------------------------处理事件-------------------------------------------*/
            /**
             * 处理选择行动作
             * @author  韦胜健
             * @date    2019/6/23 17:45
             */
            pl_selectRow(dataRow) {
                this.option.pl_changeSelectRow(dataRow)
            },
            /**
             * 处理双击行书剑
             * @author  韦胜健
             * @date    2019/6/23 21:02
             */
            pl_dblClickRow({item: dataRow}) {
                this.checkStatus({
                    async normal() {
                        this.table.enableEdit({index: dataRow.index})
                        this.changeStatus(this.EDIT_STATUS.update)
                        await this.$plain.nextTick()
                        window.getSelection().empty()
                    },
                })
            },
            /**
             * 处理点击删除事件
             * @author  韦胜健
             * @date    2019/6/23 21:03
             */
            async pl_startDelete() {
                await this.delete()
            },
            /**
             * 处理键盘事件
             * @author  韦胜健
             * @date    2019/6/24 13:54
             */


            /*---------------------------------------处理增删改函数-------------------------------------------*/
            async pl_insert(editData) {
                const {row, editRow, index} = editData
                const newRow = await this.option.insert({row, editRow, index})
                Object.keys(newRow).forEach(key => this.$set(editRow, key, newRow[key]))
                this.table.saveEdit({index})
                this.table.disableEdit({index})
            },
            async pl_batchInsert(editDataArray) {
                await this.option.batchInsert(editDataArray)
            },
            async pl_update(editData) {
                const {row, editRow, index} = editData
                const newRow = await this.option.update({row, editRow, index})
                Object.keys(newRow).forEach(key => this.$set(editRow, key, newRow[key]))
                this.table.saveEdit({index})
                this.table.disableEdit({index})
            },
            async pl_batchUpdate(editData) {
            },
            async pl_delete(index) {
                const row = this.option.list[index]
                await this.option.delete({row, index})
                this.option.list.splice(index, 1)
                const lastNum = this.option.list.length
                if (lastNum === 0) {
                    index = null
                } else {
                    if (lastNum - 1 < index) {
                        index = lastNum - 1
                    }
                }
                await this.$plain.nextTick()
                this.selectRow({index})
            },

            /*---------------------------------------其他函数-------------------------------------------*/
            /**
             * 初始化键盘事件
             * @author  韦胜健
             * @date    2019/6/24 14:55
             */
            async pl_initKeyboard() {
                console.log('pl_initKeyboard')
                this.pl_mouseenter = () => {
                    this.pl_keydown = (e) => {
                        const names = [];
                        e.ctrlKey && names.push('ctrl')
                        e.altKey && names.push('alt')
                        e.shiftKey && names.push('shift')
                        names.push(e.key)
                        const name = names.join('+')
                        if (!this.keydownListener[name]) return
                        console.log(name)
                        e.returnValue = this.keydownListener[name](e, name)
                    }
                    window.document.addEventListener('keydown', this.pl_keydown)
                }
                this.pl_mouseleave = () => window.document.removeEventListener('keydown', this.pl_keydown)
                this.$el.addEventListener('mouseenter', this.pl_mouseenter)
                this.$el.addEventListener('mouseleave', this.pl_mouseleave)
            },
        },
        beforeDestroy() {
            console.log(!!this.pl_mouseenter)
            !!this.pl_mouseenter && this.$el.removeEventListener('mouseenter', this.pl_mouseenter)
            !!this.pl_mouseleave && this.$el.removeEventListener('mouseleave', this.pl_mouseleave)
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .plain-table {
            outline: none;

            .plain-table-head {
                padding-bottom: plVar(padding);
                display: flex;
                justify-content: space-between;
            }

            .plain-table-foot {
                padding-top: plVar(padding);

                .plain-table-pagination-no-more {
                    color: plVar(colorPrimaryDeep);
                    cursor: pointer;
                }
            }
        }
    }
</style>
