export const DEFAULT_BUTTON_ORDER = {
    insert: 100,
    update: 50,
    delete: 1,
    other: -1,
}

export const StandardButtons = {
    insertButton: {
        type: 'insert',                         //按钮类型，受安全性控制
        order: 100,                             //排序
        display: true,                          //是否显示
        label: '新建',                          //文本
        icon: 'pad-plus-circle',                //图标
        needRow: false,                         //是否需要选择一行数据
        confirm: false,                         //是否需要确认对话框
        inner: false,                           //在内部还是外部
        confirmMessage: null,                   //确认对话框信息
        key: 'ctrl+n',
        disabled() {
            // console.log('disabled')
            if (!this.option) return true
            if (!!this.option.parentOption && (!this.option.parentOption.selectDataRow || !!this.option.parentOption.loading)) return true
            return false
        },
        handler() {
            this.newInsert()
        },
    },
    copyButton: {
        type: 'insert',
        label: '复制',
        icon: 'pad-file-copy',
        key: 'ctrl+b',
        handler() {
            this.copy()
        },
    },
    deleteButton: {
        type: 'delete',
        label: '删除',
        icon: 'pad-delete',
        key: 'ctrl+d',
        handler() {
            this.delete()
        },
    },

    batchUpdateButton: {
        type: 'update',
        label: '多行编辑',
        icon: 'pad-unorderedlist',
        inner: true,
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
        label: '表单编辑',
        icon: 'pad-edit',
        inner: true,
        handler() {
            this.$message.show('表单编辑')
        },
    },
    batchModifyButton: {
        type: 'update',
        label: '批量修改',
        icon: 'pad-edit-square',
        inner: true,
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
        handler() {
            this.$message.show('记录总数')
        },
    },


    exportButton: {
        type: 'other',
        label: '数据导出',
        icon: 'pad-export',
        inner: true,
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
