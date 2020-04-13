export default {
    name: 'pl-date-base-panel-year',
    props: {},
    data() {
        return {}
    },
    render(h) {
        return (
            <div class="pl-date-base-panel-year">
                <pl-date-base-panel-header>
                    <div slot="left">
                        <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYear}/>
                    </div>
                    <div slot="center">
                        <span>2020</span>
                    </div>
                    <div slot="right">
                        <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYear}/>
                    </div>
                </pl-date-base-panel-header>
            </div>
        )
    },
}