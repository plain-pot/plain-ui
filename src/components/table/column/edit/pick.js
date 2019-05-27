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
            ids: [],
            normal(h, dataRow) {
                return (
                    <pl-radio value={that.ids.indexOf(dataRow.id) > -1} onInput={e => that.pl_input(e, dataRow)} onClick={(e) => e.stopPropagation()} onDblclick={e => e.stopPropagation()}/>
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
        dataIds() {
            return this.data.map(item => item.id)
        },
        checkAllStatus() {
            if (this.dataIds.every(id => this.ids.indexOf(id) > -1)) return 'all'
            if (this.dataIds.some(id => this.ids.indexOf(id) > -1)) return 'some'
            return 'none'
        },
    },
    methods: {
        pl_clickCheckAll() {
            switch (this.checkAllStatus) {
                case 'all':
                    this.$plain.$utils.removeSome(this.ids, id => this.dataIds.indexOf(id) > -1)
                    break
                case 'some':
                    this.ids = [...this.ids, ...this.dataIds]
                    break
                case 'none':
                    this.ids = [...this.ids, ...this.dataIds]
            }
        },
        pl_input(val, dataRow) {
            if (!!val) this.ids.push(dataRow.id)
            else {
                const index = this.ids.indexOf(dataRow.id)
                index > -1 && this.ids.splice(index, 1)
            }
        },
        pl_clickRow({item}) {
            const val = this.ids.indexOf(item.id) > -1
            this.pl_input(!val, item)
        },
    },
}