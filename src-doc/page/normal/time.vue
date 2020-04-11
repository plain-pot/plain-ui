<template>
    <div class="demo-time">
        <demo-row title="time-base-column">
            <demo-row title="基本用法">
                <demo-line>
                    {{val[0]}}
                </demo-line>
                <pl-time-base-column v-model="val[0]"/>
                <pl-time-base-column v-model="val[0]"/>
            </demo-row>
            <demo-row title="模式">
                <demo-line>
                    {{val[1]}}:{{val[2]}}:{{val[3]}}
                </demo-line>
                <pl-time-base-column v-model="val[1]" layout="h"/>
                <pl-time-base-column v-model="val[2]" layout="m"/>
                <pl-time-base-column v-model="val[3]" layout="s"/>
            </demo-row>
            <demo-row title="最大最小值">
                <demo-line>
                    {{val[4]}}
                </demo-line>
                <pl-time-base-column v-model="val[4]" :max="20" :min="10"/>
            </demo-row>
            <demo-row title="自定义选项">
                <demo-line>
                    {{val[5]}}
                </demo-line>
                <pl-time-base-column v-model="val[5]" :custom="timeBaseColumn.custom"/>
            </demo-row>

        </demo-row>

        <demo-row title="time-base-panel">
            <demo-row title="基本用法">
                <demo-line>
                    {{val[6]}}
                </demo-line>
                <pl-time-base-panel v-model="val[6]"/>
                <pl-time-base-panel v-model="val[6]"/>
            </demo-row>

            <demo-row title="最大最小值">
                <demo-line>
                    min:{{val[8]}}
                    max:{{val[7]}}
                </demo-line>
                <demo-line>
                    <pl-button mode="text" label="clear" @click="$set(val,9,null)"/>
                    {{val[9]}}
                </demo-line>
                <pl-time-base-panel :max="val[7]" :min="val[8]" v-model="val[9]"/>
            </demo-row>

            <demo-row title="选择的模式">
                <demo-row title="仅选择：时">
                    <demo-line>
                        {{val[10]}}
                    </demo-line>
                    <pl-time-base-panel v-model="val[10]" :layout="['h']" valueFormat="HH"/>
                    <pl-time-base-panel v-model="val[10]" :layout="['h']" valueFormat="HH"/>
                </demo-row>
                <demo-row title="仅选择：时分">
                    <demo-line>
                        {{val[11]}}
                    </demo-line>
                    <pl-time-base-panel v-model="val[11]" :layout="['h','m']" valueFormat="HH:mm" max="15:15" min="08:08"/>
                    <pl-time-base-panel v-model="val[11]" :layout="['h','m']" valueFormat="HH:mm"/>
                </demo-row>
                <demo-row title="仅选择：分秒">
                    <demo-line>
                        <pl-button mode="text" label="clear" @click="$set(val,12,null)"/>
                        {{val[12]}}
                    </demo-line>
                    <pl-time-base-panel v-model="val[12]" :layout="['m','s']" valueFormat="mm:ss" :checkDisabled="checkDisabled" @change="onMSChange"/>
                    <pl-time-base-panel v-model="val[12]" :layout="['m','s']" valueFormat="mm:ss"/>
                </demo-row>
            </demo-row>

            <demo-row title="自定义选项">
                <demo-row title="自定义选项以及值限制示例">
                    <demo-line>
                        <pl-button mode="text" label="clear" @click="$set(val,13,null)"/>
                        {{val[13]}}
                    </demo-line>
                    <pl-time-base-panel v-model="val[13]" :layout="['h','m']" valueFormat="HH:mm" :custom="custom" @change="onCustomChange"/>
                    <pl-time-base-panel v-model="val[13]" :layout="['h','m']" valueFormat="HH:mm" :custom="custom" @change="onCustomChange"/>
                </demo-row>
            </demo-row>
        </demo-row>

        <demo-row title="time-range-panel">
            <demo-row title="基本用法">
                <demo-line>
                    start:{{val[14]}}
                </demo-line>
                <demo-line>
                    end:{{val[15]}}
                </demo-line>
                <demo-line>
                    <pl-button mode="text" label="clear" @click="()=>{$set(val,14,null);$set(val,15,null)}"/>
                </demo-line>
                <pl-time-range-panel :start.sync="val[14]" :end.sync="val[15]"/>
                <pl-time-range-panel :start.sync="val[14]" :end.sync="val[15]"/>
            </demo-row>

            <demo-row title="最大最小值">
                <demo-line>max="14:14:14" min="08:08:08"</demo-line>
                <demo-line>
                    start:{{val[16]}}
                </demo-line>
                <demo-line>
                    end:{{val[17]}}
                </demo-line>
                <demo-line>
                    <pl-button mode="text" label="clear" @click="()=>{$set(val,16,null);$set(val,17,null)}"/>
                </demo-line>
                <pl-time-range-panel :start.sync="val[16]" :end.sync="val[17]" max="14:14:14" min="08:08:08"/>
                <pl-time-range-panel :start.sync="val[16]" :end.sync="val[17]"/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-time-panel">
            <demo-row title="base panel:基本用法">
                <demo-line>
                    {{val[18]}}
                </demo-line>
                <pl-time-panel v-model="val[18]"/>
                <pl-time-panel v-model="val[18]"/>
            </demo-row>
            <demo-row title="base panel:最大最小值">
                <demo-line>
                    max="12:12:12" min="08:08:08"
                </demo-line>
                <demo-line>
                    {{val[19]}}
                </demo-line>
                <pl-time-panel v-model="val[19]" max="12:12:12" min="08:08:08"/>
                <pl-time-panel v-model="val[19]" max="12:12:12" min="08:08:08"/>
            </demo-row>
            <demo-row title="range panel">
                <demo-row title="range panel:基本用法">
                    <demo-line>
                        start:{{val[20]}}
                    </demo-line>
                    <demo-line>
                        end:{{val[21]}}
                    </demo-line>
                    <pl-time-panel :start.sync="val[20]" :end.sync="val[21]" range/>
                    <pl-time-panel :start.sync="val[20]" :end.sync="val[21]" range/>
                </demo-row>

                <demo-row title="range panel:最大最小值">
                    <demo-line>
                        max="12:12:12" min="08:08:08"
                    </demo-line>
                    <demo-line>
                        start:{{val[22]}}
                    </demo-line>
                    <demo-line>
                        end:{{val[23]}}
                    </demo-line>
                    <pl-time-panel :start.sync="val[22]" :end.sync="val[23]" max="12:12:12" min="08:08:08" range/>
                    <pl-time-panel :start.sync="val[22]" :end.sync="val[23]" max="12:12:12" min="08:08:08" range/>
                </demo-row>
            </demo-row>
        </demo-row>

        <demo-row title="time service">
            <demo-row title="基本用法">
                <pl-button label="basic" ref="basic" @click="basic.toggle()"/>
            </demo-row>
            <demo-row title="事件范围">
                <pl-button label="range" ref="range" @click="range.toggle()"/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-time">
            <deon-row title="基本用法">
                <demo-line>
                    {{val[30]}}
                </demo-line>
                <pl-time v-model="val[30]"/>
            </deon-row>
        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "demo-time",
        props: {},
        data() {

            const newData = (name, option, adjust) => {
                const result = {
                    service: null,
                    option: {
                        props: {
                            value: null,
                            ...(option || {}),
                        },
                        popperProps: {
                            reference: () => this.$refs[name]
                        },
                        listener: {
                            change: (val) => {
                                this.$notice(val)
                                result.option.props.value = val
                            },
                        },
                    },
                    toggle: async () => {
                        if (!result.service) {
                            result.service = await this.$plain.$time(result.option)
                        }
                        result.service.toggle()
                    },
                }
                if (!!adjust) adjust(result)
                return result
            }

            const basic = new newData('basic')
            const range = new newData('range', {
                range: true,
            }, (data) => {
                data.option.props.start = null
                data.option.props.end = null
                data.option.listener.change = (val, type) => {
                    if (type === 'start') {
                        data.option.props.start = val
                    } else {
                        data.option.props.end = val
                    }
                    this.$notice(`${type}:${val}`)
                }

            })

            return {
                val: {
                    6: '20:15:10',

                    7: '12:12:12',
                    8: '08:08:08',
                },

                timeBaseColumn: {
                    custom: () => {
                        let start = 0
                        let step = 15
                        let options = []
                        while (start < 60) {
                            options.push(start)
                            start += step
                        }
                        return options
                    }
                },

                basic,
                range,
            }
        },
        methods: {
            checkDisabled(num, layout, value) {
                if (layout === 'm') {
                    return num > 15 || num < 8
                }
                if (layout === 's') {
                    if (value.isNull) {
                        // 没有值的时候，【秒】选项列表任何值不可以选择
                        return true
                    } else {
                        if (value.minute >= 15) {
                            return num > 15
                        }
                        if (value.minute <= 8) {
                            return num < 8
                        }
                    }
                }

                return false
            },
            onMSChange(value) {
                let maxmm = 15
                let maxss = 15
                let minmm = 8
                let minss = 8

                if (!!value) {
                    let [mm, ss] = value.split(':')
                    mm = Number(mm)
                    ss = Number(ss)
                    if (mm > maxmm || (mm === maxmm && ss > maxss)) {
                        this.$set(this.val, 12, `${this.$plain.utils.zeroize(maxmm)}:${this.$plain.utils.zeroize(maxss)}`)
                    }
                    if (mm < minmm || (mm === minmm && ss < minss)) {
                        this.$set(this.val, 12, `${this.$plain.utils.zeroize(minmm)}:${this.$plain.utils.zeroize(minss)}`)
                    }
                }
            },

            custom(layout, value) {
                if (layout === 'h') {
                    return [8, 10, 12, 14, 16, 18]
                }
                if (layout === 'm') {
                    if (value.isNull) {
                        return []
                    }
                    return value.hour > 12 ? [15, 30] : [30]
                }
            },
            onCustomChange(value) {
                if (!!value) {
                    let [HH, mm] = value.split(':')
                    HH = Number(HH)
                    mm = Number(mm)
                    if (HH > 12) {
                        if ([15, 30].indexOf(mm) === -1) {
                            mm = 15
                        }
                    } else {
                        if ([30].indexOf(mm) === -1) {
                            mm = 30
                        }
                    }

                    const newValue = `${this.$plain.utils.zeroize(HH)}:${this.$plain.utils.zeroize(mm)}`
                    if (newValue !== value) {
                        this.$set(this.val, 13, newValue)
                    }
                }
            },
        },
    }
</script>

<style lang="scss">
</style>