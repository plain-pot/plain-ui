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
            p_table: null,
            normal(h, {row, rowIndex, editRow, showRow, col, colIndex, require, prop, required}) {
                return (<pm-img {...{
                    props: {
                        ...prop
                        , ...(that.publicProps || {}),
                        id: showRow[col.field],
                        src: showRow[that.src],
                        required,
                        disabled: true,
                        customPreview: () => that.pl_customPreview(rowIndex),
                    },
                }}/>)
            },
            edit(h, {row, rowIndex, editRow, col, colIndex, require, prop, required}) {
                return (<pm-img {...{
                    props: {
                        ...prop
                        , ...(that.publicProps || {}),
                        id: editRow[col.field],
                        src: editRow[that.src],
                        required,
                        disabled: false,
                        customPreview: () => that.pl_customPreview(rowIndex),
                    },
                    on: {
                        'update:id': (val) => that.$set(editRow, col.field, val),
                        'update:src': (val) => that.$set(editRow, that.src, val),
                    }
                }}/>)
            },
        }
    },
    computed: {
        table() {
            if (!this.p_table) {
                this.p_table = this.$plain.$dom.findComponentUpward(this, 'pl-base-table')
            }
            return this.p_table
        },
    },
    methods: {
        pl_customPreview(index) {
            const imgList = this.table.p_data.map(({editRow}) => editRow[this.src])
            this.$img.preview(imgList, index)
        },
    },
}
