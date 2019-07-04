export default {
    name: 'index',
    props: {
        page: {type: Number, default: 1},
        pageSize: {type: Number, default: 10},

        align: {default: 'center'},
        width: {default: '36'},
        sort: {default: false},
        search: {default: false},
        title: {default: '#'},
        placeLeft: {default: true},
        order: {default: 999},
        import: {default: false},
        export: {default: false},
        formEditable: {default: false},
        batchModify: {default: false},
    },
    data() {
        const that = this
        return {
            normal(h, {row, editRow, showRow, text, rowIndex, col, colIndex, prop, fixedRow}) {
                if (fixedRow) return null
                return <span>{(that.page - 1) * that.pageSize + rowIndex + 1}</span>
            },
        }
    },
}
