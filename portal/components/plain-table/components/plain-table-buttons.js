import {PLAIN_TABLE_STATUS} from "../index";

const INSERT = 'insert'
const UPDATE = 'update'
const DELETE = 'delete'
const OTHER = 'other'

export const PLAIN_BUTTON_TYPE = {
    INSERT: INSERT,
    UPDATE: UPDATE,
    DELETE: DELETE,
    OTHER: OTHER,
}

export const DEFAULT_BUTTON_ORDER = {
    [INSERT]: 100,
    [UPDATE]: 50,
    [DELETE]: 1,
    [OTHER]: -1,
}

export const StandardButtons = {
    insertButton: {
        type: 'insert',                         //按钮类型，受安全性控制
        status: PLAIN_TABLE_STATUS.normal,      //表格处于何种状态时，按钮可用
        order: 100,                             //排序
        display: true,                          //是否显示
        label: '新建',                          //文本
        icon: 'pad-plus-circle',                //图标
        needRow: false,                         //是否需要选择一行数据
        confirm: false,                         //是否需要确认对话框
        inner: false,                           //在内部还是外部
        confirmMessage: null,                   //确认对话框信息
        key: 'alt+n',
        handler() {
            this.newInsert()
        },
    },
    copyButton: {
        type: 'insert',
        status: PLAIN_TABLE_STATUS.normal,
        label: '复制',
        icon: 'pad-file-copy',
        key: 'alt+b',
        needRow: true,
        handler() {
            this.copy()
        },
    },
    deleteButton: {
        type: 'delete',
        status: PLAIN_TABLE_STATUS.normal,
        label: '删除',
        icon: 'pad-delete',
        key: 'alt+d',
        needRow: true,
        handler() {
            this.delete()
        },
    },

    batchUpdateButton: {
        type: 'update',
        status: PLAIN_TABLE_STATUS.normal,
        label: '多行编辑',
        icon: 'pad-unorderedlist',
        inner: true,
        needRow: true,
        handler() {
            this.checkStatus({
                async normal() {
                    this.table.enableEdit()
                    this.changeStatus(this.EDIT_STATUS.update)
                },
            })
        },
    },
    formEditButton: {
        type: 'update',
        status: PLAIN_TABLE_STATUS.normal,
        label: '表单编辑',
        icon: 'pad-edit',
        inner: true,
        key: 'alt+i',
        needRow: true,
        handler(dataRow) {
            this.$plain.$formDialog.edit({
                cols: this.p_bodyCols,
                dataRow,
                onConfirm: async (newDataRow) => {
                    dataRow.editRow = newDataRow.editRow
                    await this.pl_update(dataRow)
                },
            })
        },
    },
    batchModifyButton: {
        type: 'update',
        status: PLAIN_TABLE_STATUS.normal,
        label: '批量修改',
        icon: 'pad-edit-square',
        inner: true,
        needRow: true,
        handler() {
            this.$message.show('批量修改')
        },
    },
    customFilterButton: {
        label: '高级筛选',
        icon: 'pad-filter',
        inner: true,
        handler() {
            this.$message.show('高级筛选')
        },
    },
    customSortButton: {
        label: '高级排序',
        icon: 'pad-sort-ascending',
        inner: true,
        handler() {
            this.$message.show('高级排序')
        },
    },
    configHeightButton: {
        label: '高度设置',
        icon: 'pad-menu',
        inner: true,
        handler() {
            this.$message.show('高度设置')
        },
    },
    showDetailButton: {
        label: '记录明细',
        icon: 'pad-detail',
        inner: true,
        handler() {
            this.$message.show('记录明细')
        },
    },
    showCountButton: {
        label: '记录总数',
        icon: 'pad-table1',
        inner: true,
        async handler() {
            const ret = await this.option.queryCount()
            this.$dialog.show(`当前记录总数为：${ret}`)
        },
    },


    exportButton: {
        type: 'other',
        label: '数据导出',
        icon: 'pad-export',
        inner: true,
        needRow: true,
        async handler() {
            const queryParam = await this.option.getQueryParam()
            const content = await this.$http.axios({
                method: 'post',
                url: this.option.p_urls.exp,
                data: {
                    ...queryParam,
                    attrMap: this.p_bodyCols.reduce((ret, item) => {
                        !!item.export && (ret[item.field] = item.title)
                        return ret
                    }, {})
                },
                responseType: 'blob'
            })
            const blob = new Blob([content.data])
            const fileName = `导出数据-${this.$plain.$utils.dateFormat(new Date(), 'YYYYMMDDHHmmss')}.xlsx`
            if ('download' in document.createElement('a')) {
                // 非IE下载
                const a = document.createElement('a')
                a.download = fileName
                a.style.display = 'none'
                a.href = URL.createObjectURL(blob)
                document.body.appendChild(a)
                a.click()
                // 释放URL 对象
                URL.revokeObjectURL(a.href)
                document.body.removeChild(a)
            } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName)
            }
        },
    },
    importButton: {
        type: 'other',
        label: '数据导入',
        icon: 'pad-Import',
        inner: true,
        async handler() {
            // console.log('导入');
            const file = await this.$file.getFile(false, 'excel');
            // console.log(file);
            let param = new FormData();
            param.append("module", "lov");
            param.append("file", file);
            param.append("titleFieldMapJsonString", JSON.stringify(this.p_bodyCols.reduce((ret, item) => {
                !!item.export && (ret[item.title] = item.field)
                return ret
            }, {})))
            const {data} = await this.$http.axios({
                url: this.option.p_urls.imp,
                method: 'post',
                data: param,
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: e => {
                    var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
                    console.log('completeProgress:' + completeProgress)
                }
            })
            if (data.code !== 0) {
                this.$dialog.show('导入失败：' + data.ret)
            } else {
                this.$dialog.show('导入成功')
                this.option.reload()
            }
        },
    },
}

export const PlainButtonUtils = {
    getButtons(standardButtons, optionButtons, plainOption, ctx, $plain) {
        const allButtonNames = Array.from(new Set(Object.keys(standardButtons).concat(Object.keys(optionButtons))))
        const buttons = []
        allButtonNames.forEach(name => {
            let sb = standardButtons[name]
            let ob = optionButtons[name]
            let btn;

            if (ob === false) return
            if (!sb) {
                btn = ob
                btn.standard = false
            } else {
                if (ob === true || ob == null) {
                    btn = sb
                    btn.standard = true
                } else {
                    const oldHandler = sb.handler
                    btn = $plain.$utils.deepmerge(sb, ob)
                    if (btn.handler === oldHandler) btn.standard = true
                }
            }

            if (!!btn) {
                if (btn.type == null) btn.type = 'other'
                if (btn.display == null) btn.display = true
                if (btn.disabled == null) btn.disabled = false
                btn.name = name
                btn.ctx = !!btn.standard ? ctx : plainOption.context
                buttons.push(btn)
            }
        })
        return buttons
    },
    getButtonDisabledMap(buttons, plainOption, $plain) {
        return buttons.reduce((ret, btn) => {
            let flag = null
            if (!!plainOption) {
                if (btn.needRow && !plainOption.selectDataRow) flag = true
                else if (btn.type !== OTHER && !!plainOption.parentOption && (!plainOption.parentOption.selectDataRow || plainOption.parentOption.loading || plainOption.hasParentEditing())) {
                    flag = true
                }
            }
            const status = plainOption.tableStatus || PLAIN_TABLE_STATUS.normal
            if (!!btn.status && btn.status !== status) {
                flag = true
            }
            if (flag == null) {
                const disabled = btn.disabled
                flag = $plain.$utils.typeOf(disabled) === 'function' ? disabled.apply(btn.ctx) : disabled
            }
            ret[btn.name] = flag == null ? false : flag
            return ret
        }, {})
    },
    getButtonDisplayMap(buttons, $plain, option) {
        return buttons.reduce((ret, btn) => {
            if (btn.type !== PLAIN_BUTTON_TYPE.OTHER && !option.enable[btn.type]) {
                ret[btn.name] = false
            } else {
                const display = btn.display
                ret[btn.name] = $plain.$utils.typeOf(display) === 'function' ? display.apply(btn.ctx) : display
            }
            return ret
        }, {})
    },
    getButtonHandlerMap(buttons, disabled, display, getSelectDataRow) {
        return buttons.reduce((ret, btn) => {
            const handler = btn.handler
            ret[btn.name] = async (e, isButtonClick) => {
                // console.log(btn.name)
                if (!!isButtonClick) {
                    if (disabled[btn.name]) return
                    if (!display[btn.name]) return
                }
                let param;
                if (!!btn.needRow) param = await getSelectDataRow()
                return await handler.apply(btn.ctx, [param, e])
            }
            return ret
        }, {})
    },
}
