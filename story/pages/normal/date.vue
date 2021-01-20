<template>
    <div>
        <demo-row title="基础面板">
            <demo-row title="年份">
                <demo-row title="单选">
                    <pl-date-panel-year v-model="val[0]"/>
                    <pl-date-panel-year v-model="val[0]"/>
                    <div>value:{{val[0]}}</div>
                </demo-row>
                <demo-row title="多选">
                    <pl-date-panel-year v-model="val[1]" multiple/>
                    <pl-date-panel-year v-model="val[1]" multiple/>
                    <div>value:{{val[1]}}</div>
                </demo-row>
                <demo-row title="范围选择">
                    <pl-date-panel-year v-model:start="val[2]" v-model:end="val[3]" range/>
                    <pl-date-panel-year v-model:start="val[2]" v-model:end="val[3]" range/>
                    <div>start:{{val[2]}}</div>
                    <div>end:{{val[3]}}</div>
                </demo-row>
                <demo-row title="最大最小值">
                    <pl-date-panel-year v-model:start="val[2]" v-model:end="val[3]" range max="2050" min="2021"/>
                    <pl-date-panel-year v-model:start="val[2]" v-model:end="val[3]" range/>
                    <div>max:2050</div>
                    <div>min:2021</div>
                    <div>start:{{val[2]}}</div>
                    <div>end:{{val[3]}}</div>
                </demo-row>
            </demo-row>
            <demo-row title="年月">
                <demo-row title="单选">
                    <pl-date-panel-month v-model="val[4]"/>
                    <pl-date-panel-month v-model="val[4]"/>
                    <div>{{val[4]}}</div>
                </demo-row>
                <demo-row title="多选">
                    <pl-date-panel-month v-model="val[5]" multiple/>
                    <pl-date-panel-month v-model="val[5]" multiple/>
                    <div>{{val[5]}}</div>
                </demo-row>
                <demo-row title="范围选择">
                    <pl-date-panel-month v-model:start="val[6]" v-model:end="val[7]" range/>
                    <pl-date-panel-month v-model:start="val[6]" v-model:end="val[7]" range/>
                    <div>start:{{val[6]}}</div>
                    <div>end:{{val[7]}}</div>
                </demo-row>
                <demo-row title="最大最小值">
                    <pl-date-panel-month v-model:start="val[6]" v-model:end="val[7]" range max="2050-08" min="2021-03"/>
                    <pl-date-panel-month v-model:start="val[6]" v-model:end="val[7]" range/>
                    <div>max:2050-08</div>
                    <div>min:2021-03</div>
                    <div>start:{{val[6]}}</div>
                    <div>end:{{val[7]}}</div>
                </demo-row>
            </demo-row>
            <demo-row title="日期">
                <demo-row title="单选">
                    <pl-date-panel-date v-model="val[8]"/>
                    <pl-date-panel-date v-model="val[8]"/>
                    <div>value:{{val[8]}}</div>
                </demo-row>
                <demo-row title="多选">
                    <pl-date-panel-date v-model="val[9]" multiple/>
                    <pl-date-panel-date v-model="val[9]" multiple/>
                    <div>value:{{val[9]}}</div>
                </demo-row>
                <demo-row title="日期时间">
                    <pl-date-panel-date v-model="val[10]" datetime defaultTime="08:30:00"/>
                    <pl-date-panel-date v-model="val[10]" datetime/>
                    <div>value:{{val[10]}}</div>
                </demo-row>
                <demo-row title="最大最小值">
                    <pl-date-panel-date v-model="val[11]" datetime defaultTime="08:30:00" max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"/>
                    <pl-date-panel-date v-model="val[11]" datetime :firstWeekDay="0"/>
                    <div>max:2021-05-05 12:00:00</div>
                    <div>min:2019-05-05 08:30:15</div>
                    <div>value:{{val[11]}}</div>
                </demo-row>
            </demo-row>
            <demo-row title="日期范围">
                <demo-row title="基本选择">
                    <pl-date-panel-range v-model:start="val[12]" v-model:end="val[13]"/>
                    <pl-date-panel-range v-model:start="val[12]" v-model:end="val[13]"/>
                    <div>start:{{val[12]}}</div>
                    <div>end:{{val[13]}}</div>
                </demo-row>
                <demo-row title="最大最小值">
                    <pl-date-panel-range v-model:start="val[14]"
                                         v-model:end="val[15]"
                                         datetime
                                         defaultStartTime="08:30:00"
                                         defaultEndTime="20:30:30"
                                         max="2021-05-05 12:00:00"
                                         min="2019-05-05 08:30:15"/>
                    <pl-date-panel-range v-model:start="val[14]" v-model:end="val[15]" datetime/>
                    <div>max:2021-05-05 12:00:00</div>
                    <div>min:2019-05-05 08:30:15</div>
                    <div>start:{{val[14]}}</div>
                    <div>end:{{val[15]}}</div>
                </demo-row>
            </demo-row>
            <demo-row title="周">
                <demo-row title="单选">
                    <pl-date-panel-week v-model="val[16]"/>
                    <pl-date-panel-week v-model="val[16]" :firstWeekDay="0"/>
                    <div>value:{{val[16]}}</div>
                </demo-row>
                <demo-row title="多选">
                    <pl-date-panel-week v-model="val[17]" multiple/>
                    <pl-date-panel-week v-model="val[17]" multiple/>
                    <div>value:{{val[17]}}</div>
                </demo-row>
                <demo-row title="范围选择">
                    <pl-date-panel-week v-model:start="val[18]" v-model:end="val[19]" range max="2021-05-05" min="2019-05-05"/>
                    <pl-date-panel-week v-model:start="val[18]" v-model:end="val[19]" range/>
                    <div>max:2021-05-05</div>
                    <div>min:2019-05-05</div>
                    <div>start:{{val[18]}}</div>
                    <div>end:{{val[19]}}</div>
                </demo-row>
            </demo-row>
            <demo-row title="季度">
                <demo-row title="单选">
                    <pl-date-panel-quarter v-model="val[20]"/>
                    <pl-date-panel-quarter v-model="val[20]"/>
                    <div>value:{{val[20]}}</div>
                </demo-row>
                <demo-row title="多选">
                    <pl-date-panel-quarter v-model="val[21]" multiple/>
                    <pl-date-panel-quarter v-model="val[21]" multiple/>
                    <div>value:{{val[21]}}</div>
                </demo-row>
                <demo-row title="范围选择">
                    <pl-date-panel-quarter v-model:start="val[22]" v-model:end="val[23]" range max="2021-05" min="2019-05"/>
                    <pl-date-panel-quarter v-model:start="val[22]" v-model:end="val[23]" range/>
                    <div>max:2021-05</div>
                    <div>min:2019-05</div>
                    <div>start:{{val[22]}}</div>
                    <div>end:{{val[23]}}</div>
                </demo-row>
            </demo-row>
        </demo-row>
        <demo-row title="Date下拉选择">
            <demo-row title="额外内容">
                <pl-date v-model="val[24]">
                    <template #foot>
                        <pl-button size="mini" @click="setDate('yesterday')">昨天</pl-button>
                        <pl-button size="mini" @click="setDate('today')">今天</pl-button>
                        <pl-button size="mini" @click="setDate('tomorrow')">明天</pl-button>
                    </template>
                </pl-date>
                <pl-date datetime v-model="val[25]" defaultTime="08:30:00">
                    <template #foot>
                        <pl-button mode="text" size="mini" @click="setDatetime">现在</pl-button>
                    </template>
                </pl-date>
            </demo-row>
            <demo-row title="日期">
                <demo-row title="基本单选">
                    <pl-date v-model="val[24]"/>
                    <pl-date v-model="val[24]" displayFormat="YYYY年MM月DD日"/>
                    <div>value:{{val[24]}}</div>
                </demo-row>
                <demo-row title="日期时间">
                    <pl-date v-model="val[25]" datetime/>
                    <pl-date v-model="val[25]" datetime defaultTime="08:30:00" displayFormat="YYYY年MM月DD日 HH时mm分ss秒"/>
                    <div>value:{{val[25]}}</div>
                    <pl-alert>通过 defaultTime 设置默认的时间</pl-alert>
                </demo-row>
                <demo-row title="多选">
                    <pl-date v-model="val[26]" multiple/>
                    <pl-date v-model="val[26]" multiple displayFormat="YYYY年MM月DD日" :collapseTags="false"/>
                    <div>value:{{val[26]}}</div>
                    <pl-alert>多选情况下（其他面板多选也一样），collapseTags为false可以使得输入框显示的选项不折叠</pl-alert>
                </demo-row>
                <demo-row title="范围选择">
                    <pl-date v-model:start="val[27]" v-model:end="val[28]" range/>
                    <pl-date v-model:start="val[27]" v-model:end="val[28]" range displayFormat="YYYY年MM月DD日"/>
                    <div>start:{{val[27]}}</div>
                    <div>end:{{val[28]}}</div>
                </demo-row>
                <demo-row title="最大最小值">
                    <div>max:2021-05-05</div>
                    <div>min:2019-05-05</div>
                    <pl-date v-model="val[29]" max="2021-05-05" min="2019-05-05"/>
                    <div>value:{{val[29]}}</div>
                    <pl-date v-model:start="val[30]" v-model:end="val[31]" range max="2021-05-05" min="2019-05-05"/>
                    <div>start:{{val[30]}}</div>
                    <div>end:{{val[31]}}</div>
                    <pl-alert>设置最大最小值之后，除了面板中的日期会标记为不可选的状态之外，在输入框中手动输入的值也会受最大最小值限制</pl-alert>
                </demo-row>
                <demo-row title="最大最小值：日期时间">
                    <div>max:2021-05-05 12:00:00</div>
                    <div>min:2019-05-05 08:30:15</div>
                    <pl-date v-model="val[32]"
                             datetime
                             defaultTime="08:30:00"
                             max="2021-05-05 12:00:00"
                             min="2019-05-05 08:30:15"/>
                    <div>value:{{val[32]}}</div>
                    <pl-date v-model:start="val[33]"
                             v-model:end="val[34]"
                             range
                             datetime
                             defaultStartTime="08:30:00"
                             defaultEndTime="22:00:00"
                             max="2021-05-05 12:00:00"
                             min="2019-05-05 08:30:15"/>
                    <div>start:{{val[33]}}</div>
                    <div>end:{{val[34]}}</div>
                    <pl-alert>
                        设置defaultStartTie以及defaultEndTime可以设置日期时间范围选择的默认开始时间以及结束时间
                    </pl-alert>
                </demo-row>
            </demo-row>
            <demo-row title="年">
                <demo-row title="基本单选">
                    <pl-date v-model="val[35]" panel="year"/>
                    <pl-date v-model="val[35]" panel="year" displayFormat="YYYY年"/>
                    <div>value:{{val[35]}}</div>
                </demo-row>
                <demo-row title="多选">
                    <pl-date v-model="val[36]" panel="year" multiple/>
                    <pl-date v-model="val[36]" panel="year" multiple displayFormat="YYYY年"/>
                    <div>value:{{val[36]}}</div>
                </demo-row>
                <demo-row title="范围选择">
                    <pl-date v-model:start="val[37]" v-model:end="val[38]" range panel="year"/>
                    <pl-date v-model:start="val[37]" v-model:end="val[38]" range panel="year" displayFormat="YYYY年"/>
                    <div>start:{{val[37]}}</div>
                    <div>end:{{val[38]}}</div>
                </demo-row>
                <demo-row title="最大最小值限制">
                    <div>max:2050</div>
                    <div>min:2019</div>
                    <pl-date v-model="val[39]" panel="year" max="2050" min="2019"/>
                    <div>value:{{val[39]}}</div>
                    <pl-date v-model:start="val[40]" v-model:end="val[41]" range panel="year" max="2050" min="2019"/>
                    <div>start:{{val[40]}}</div>
                    <div>end:{{val[41]}}</div>
                </demo-row>
            </demo-row>
            <demo-row title="年月">
                <demo-row title="基本单选">
                    <pl-date v-model="val[42]" panel="month"/>
                    <pl-date v-model="val[42]" panel="month" displayFormat="YYYY年MM月"/>
                    <div>value:{{val[42]}}</div>
                </demo-row>
                <demo-row title="多选">
                    <pl-date v-model="val[43]" panel="month" multiple/>
                    <pl-date v-model="val[43]" panel="month" multiple displayFormat="YYYY年MM月"/>
                    <div>value:{{val[43]}}</div>
                </demo-row>
                <demo-row title="范围选择">
                    <pl-date v-model:start="val[44]" v-model:end="val[45]" range panel="month"/>
                    <pl-date v-model:start="val[44]" v-model:end="val[45]" range panel="month" displayFormat="YYYY年MM月"/>
                    <div>start:{{val[44]}}</div>
                    <div>end:{{val[45]}}</div>
                </demo-row>
                <demo-row title="最大最小值限制">
                    <div>max:2050-05</div>
                    <div>min:2019-03</div>
                    <pl-date v-model="val[46]" panel="month" max="2050-05" min="2019-03"/>
                    <div>value:{{val[46]}}</div>
                    <pl-date v-model:start="val[47]" v-model:end="val[48]" range panel="month" max="2050-05" min="2019-03"/>
                    <div>start:{{val[47]}}</div>
                    <div>end:{{val[48]}}</div>
                </demo-row>
            </demo-row>
            <demo-row title="周">
                <demo-row title="基本单选">
                    <pl-date v-model="val[49]" panel="week"/>
                    <pl-date v-model="val[49]" panel="week" displayFormat="年：gggg, 周：ww"/>
                    <div>value:{{val[49]}}</div>
                </demo-row>
                <demo-row title="多选">
                    <pl-date v-model="val[50]" panel="week" multiple/>
                    <pl-date v-model="val[50]" panel="week" multiple displayFormat="年：gggg, 周：ww"/>
                    <div>value:{{val[50]}}</div>
                </demo-row>
                <demo-row title="范围选择">
                    <pl-date v-model:start="val[51]" v-model:end="val[52]" range panel="week"/>
                    <pl-date v-model:start="val[51]" v-model:end="val[52]" range panel="week" displayFormat="年：gggg, 周：ww"/>
                    <div>start:{{val[51]}}</div>
                    <div>end:{{val[52]}}</div>
                </demo-row>
                <demo-row title="最大最小值限制">
                    <div>max:2050-05-05</div>
                    <div>min:2019-03-03</div>
                    <pl-date v-model="val[53]" panel="week" max="2050-05-05" min="2019-03-03"/>
                    <div>value:{{val[53]}}</div>
                    <pl-date v-model:start="val[54]" v-model:end="val[55]" range panel="week" max="2050-05-05" min="2019-03-03"/>
                    <div>start:{{val[54]}}</div>
                    <div>end:{{val[55]}}</div>
                </demo-row>
            </demo-row>
            <demo-row title="季度">
                <demo-row title="基本单选">
                    <pl-date v-model="val[56]" panel="quarter"/>
                    <pl-date v-model="val[56]" panel="quarter" displayFormat="年：YYYY, 季度：Q"/>
                    <div>value:{{val[56]}}</div>
                </demo-row>
                <demo-row title="多选">
                    <pl-date v-model="val[57]" panel="quarter" multiple/>
                    <pl-date v-model="val[57]" panel="quarter" multiple displayFormat="年：YYYY, 季度：Q"/>
                    <div>value:{{val[57]}}</div>
                </demo-row>
                <demo-row title="范围选择">
                    <pl-date v-model:start="val[58]" v-model:end="val[59]" range panel="quarter"/>
                    <pl-date v-model:start="val[58]" v-model:end="val[59]" range panel="quarter" displayFormat="年：YYYY, 季度：Q"/>
                    <div>start:{{val[58]}}</div>
                    <div>end:{{val[59]}}</div>
                </demo-row>
                <demo-row title="最大最小值限制">
                    <div>max:2050-05</div>
                    <div>min:2019-04</div>
                    <pl-date v-model="val[60]" panel="quarter" max="2050-05" min="2019-04"/>
                    <div>value:{{val[60]}}</div>
                    <pl-date v-model:start="val[61]" v-model:end="val[62]" range panel="quarter" max="2050-05" min="2019-04"/>
                    <div>start:{{val[61]}}</div>
                    <div>end:{{val[62]}}</div>
                </demo-row>
            </demo-row>
        </demo-row>
    </div>
</template>

<script>
    import {Date} from 'plain-ui'

    export default {
        name: "date",
        data() {
            return {
                val: {},
            }
        },
        methods: {
            setDate(type) {
                const pd = Date.plainDate.today('YYYY-MM-DD', 'YYYY-MM-DD')
                switch (type) {
                    case 'yesterday':
                        this.val[24] = pd.useMonthDate(pd.month, pd.date - 1).getValue()
                        break
                    case 'today':
                        this.val[24] = pd.getValue()
                        break
                    case 'tomorrow':
                        this.val[24] = pd.useMonthDate(pd.month, pd.date + 1).getValue()
                        break
                }
            },
            setDatetime() {
                const pd = Date.plainDate.today('YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss')
                this.val[25] = pd.getValue()
            },
        },
    }
</script>

<style lang="scss">

</style>