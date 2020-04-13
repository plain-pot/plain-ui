export default {
    name: 'pl-date-base-panel-year',
    props: {},
    data() {
        return {}
    },
    render(h) {
        return (
            <pl-date-base-panel class="pl-date-base-panel-year">
                <template slot="left">
                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYear}/>
                </template>
                <template slot="center">
                    <span>2020</span>
                </template>
                <template slot="right">
                    <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYear}/>
                </template>
                <ul class="pl-date-base-panel-year-list">

                </ul>
            </pl-date-base-panel>
        )
    },
}