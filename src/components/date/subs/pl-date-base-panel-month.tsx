export default {
    name: 'pl-date-base-panel-month',
    props: {
        value: {type: String},
        displayFormat: {type: String},
        valueFormat: {type: String},
        max: {type: String},
        min: {type: String},
        range: {type: String},
        start: {type: String},
        end: {type: String},
        checkDisabled: {type: String},
    },
    data() {
        return {}
    },
    render(h) {
        return (
            <pl-date-base-panel>
                <template slot="left">
                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYearList}/>
                </template>
                <template slot="center">
                    <span>{2020}</span>
                </template>
                <template slot="right">
                    <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYearList}/>
                </template>
            </pl-date-base-panel>
        )
    },
    computed: {},
    methods: {},
}
