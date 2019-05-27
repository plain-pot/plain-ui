export default {
    name: 'pick',
    props: {
        align: {default: 'center'},
        width: {default: '36'},
        sort: {default: false},
        search: {default: false},
        placeLeft: {default: true},
        order: {default: 1000},
        data: {},
        switchOnClickRow: {type: Boolean, default: true},
    },
    data() {
        const that = this
        return {
            p_table: null,
            p_data: [],
            normal(h, dataRow) {
                return (
                    <pl-radio value={that.p_dataIds.indexOf(dataRow.id) > -1} onInput={e => that.pl_input(e, dataRow)} onClick={(e) => e.stopPropagation()} onDblclick={e => e.stopPropagation()}/>
                )
            },
            head() {
                return (
                    <pl-check-all status={that.checkAllStatus} onClick={that.pl_clickCheckAll} label={null}/>
                )
            },
        }
    },
    watch: {
        switchOnClickRow: {
            immediate: true,
            async handler(val) {
                await this.$plain.nextTick()
                !!val ? this.table.$on('clickRow', this.pl_clickRow) : this.table.$off('clickRow', this.pl_clickRow)
            },
        },
    },
    computed: {
        table() {
            if (!this.p_table) {
                this.p_table = this.$plain.$dom.findComponentUpward(this, 'pl-base-table')
            }
            return this.p_table
        },
        p_dataIds() {
            if (!this.p_data) return []
            return this.p_data.map(item => item.id)
        },
        dataIds() {
            return this.data.map(item => item.id)
        },
        checkAllStatus() {
            if (this.dataIds.every(id => this.p_dataIds.indexOf(id) > -1)) return 'all'
            if (this.dataIds.some(id => this.p_dataIds.indexOf(id) > -1)) return 'some'
            return 'none'
        },
    },
    methods: {
        getSelected() {
            return this.p_data.map(item => item.row)
        },
        pl_clickCheckAll() {
            switch (this.checkAllStatus) {
                case 'all':
                    this.$plain.$utils.removeSome(this.p_data, data => this.dataIds.indexOf(data.id) > -1)
                    break
                case 'some':
                    this.p_data = [...this.data, ...this.p_data]
                    break
                case 'none':
                    this.p_data = [...this.data, ...this.p_data]
            }
        },
        pl_input(val, dataRow) {
            if (!!val) this.p_data.push(dataRow)
            else {
                const index = this.p_dataIds.indexOf(dataRow.id)
                index > -1 && this.p_data.splice(index, 1)
            }
        },
        pl_clickRow({item}) {
            const val = this.p_dataIds.indexOf(item.id) > -1
            this.pl_input(!val, item)
        },
    },
    beforeDestroy() {
        this.p_data = []
        !!this.switchOnClickRow && this.table.$off('clickRow', this.pl_clickRow)
    }
}