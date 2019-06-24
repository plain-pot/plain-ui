export const PlainTableButtons = {
    insertButton: {
        type: 'insert',                         //按钮类型，受安全性控制
        order: 100,                             //排序
        disabled: false,                        //是否禁用
        display: true,                          //是否显示
        label: '新建',                           //文本
        icon: 'pad-plus-circle',                //图标
        needRow: false,                         //是否需要选择一行数据
        confirm: false,                         //是否需要确认对话框
        confirmMessage: null,                   //确认对话框信息

        handler() {
            console.log('新建')
        },
    },
    copyButton: {
        type: 'insert',
        label: '复制',
        icon: 'pad-file-copy',
        handler() {
            console.log('复制')
        },
    },
    deleteButton: {
        type: 'delete',
        label: '删除',
        icon: 'pad-delete',
        handler() {
            console.log('删除')
        },
    },
}