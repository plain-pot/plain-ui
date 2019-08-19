export default {
    name: 'img',
    props: {
        width: {default: 80},
        search: {default: false},
        sort: {default: false},

        src: {type: String, require: true},
    },
    data() {
        const that = this
        return {
            normal(h, {row, editRow, showRow, col, colIndex, require, prop, required}) {
                return (<pm-img {...{
                    props: {
                        ...prop
                        , ...(that.publicProps || {}),
                        id: showRow[col.field],
                        src: showRow[that.src],
                        required,
                        disabled: true,
                    },
                }}/>)
            },
            edit(h, {row, editRow, col, colIndex, require, prop, required}) {
                return (<pm-img {...{
                    props: {
                        ...prop
                        , ...(that.publicProps || {}),
                        id: editRow[col.field],
                        src: editRow[that.src],
                        required,
                        disabled: false,
                    },
                    on: {
                        'update:id': (val) => that.$set(editRow, col.field, val),
                        'update:src': (val) => that.$set(editRow, that.src, val),
                    }
                }}/>)
            },
        }
    },
}
