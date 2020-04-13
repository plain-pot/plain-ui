export default {
    name: 'pl-date-base-panel-year',
    props: {
        value: {type: Number},
    },
    data() {
        const p_value: number = this.value
        const selectYear: number = this.value
        return {
            p_value,
            selectYear,
        }
    },
    render(h) {
        return (
            <pl-date-base-panel class="pl-date-base-panel-year">
                <template slot="left">
                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYearList}/>
                </template>
                <template slot="center">
                    <span>{this.data.title}</span>
                </template>
                <template slot="right">
                    <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYearList}/>
                </template>
                <template slot="content">
                    <transition name="pl-transition-fade" mode="out-in">
                        <ul class="pl-date-base-panel-year-list" key={this.data.selectYear}>
                            {this.data.list.map((item, index) => (
                                <li class={[
                                    'pl-date-base-panel-year-item',
                                    {
                                        'pl-date-base-panel-year-item-now': item.now,
                                        'pl-date-base-panel-year-item-active': item.active,
                                    }
                                ]}
                                    key={index}>
                                    <span>{item.year}</span>
                                </li>
                            ))}
                        </ul>
                    </transition>
                </template>
            </pl-date-base-panel>
        )
    },
    computed: {
        data() {
            let {p_value: value, selectYear} = this
            let nowYear = new Date().getFullYear()

            selectYear = selectYear || nowYear
            selectYear = Number(String(selectYear).slice(0, -1) + '0')
            let list = []
            for (let i = selectYear; i < selectYear + 20; i++) {
                list.push({
                    year: i,
                    now: i === nowYear,
                    active: value === nowYear
                })
            }
            return {
                list,
                title: `${selectYear}-${selectYear + 19}`,
                selectYear,
            }
        },
    },
    methods: {
        /*---------------------------------------methods-------------------------------------------*/
        prevYearList() {
            this.selectYear = this.data.selectYear - 20
        },
        nextYearList() {
            this.selectYear = this.data.selectYear + 20
        },
    },
}