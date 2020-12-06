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

        <demo-row title="time-base-panel" group>
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
                    <pl-button label="clear" @click="val['9'] = null"/>
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
                        <pl-button mode="text" label="clear" @click="val['12'] = null"/>
                        {{val[12]}}
                    </demo-line>
                    <pl-time-base-panel v-model="val[12]" :layout="['m','s']" valueFormat="mm:ss" :checkDisabled="checkDisabled" @change="onMSChange"/>
                    <pl-time-base-panel v-model="val[12]" :layout="['m','s']" valueFormat="mm:ss"/>
                </demo-row>
            </demo-row>

            <demo-row title="自定义选项">
                <demo-row title="自定义选项以及值限制示例">
                    <demo-line>
                        <pl-button mode="text" label="clear" @click="val['13'] = null"/>
                        {{val[13]}}
                    </demo-line>
                    <!--                    <pl-time-base-panel v-model="val[13]" :layout="['h','m']" valueFormat="HH:mm" :custom="custom" @change="onCustomChange"/>-->
                    <pl-time-base-panel v-model="val[13]" :layout="['h','m']" valueFormat="HH:mm" :custom="custom"/>
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
                    <pl-button mode="text" label="clear" @click="()=>{val['14']=null;val['15']=null}"/>
                </demo-line>
                <pl-time-range-panel v-model:start="val[14]" v-model:end="val[15]" valueFormat="HHmmss"/>
                <pl-time-range-panel v-model:start="val[14]" v-model:end="val[15]" valueFormat="HHmmss"/>
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
                    <pl-button mode="text" label="clear" @click="()=>{val['16']=null;val['17']=null}"/>
                </demo-line>
                <pl-time-range-panel v-model:start="val[16]" v-model:end="val[17]" max="14:14:14" min="08:08:08"/>
                <pl-time-range-panel v-model:start="val[16]" v-model:end="val[17]"/>
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
                    <pl-time-panel v-model:start="val[20]" v-model:end="val[21]" range/>
                    <pl-time-panel v-model:start="val[20]" v-model:end="val[21]" range/>
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
                    <pl-time-panel v-model:start="val[22]" v-model:end="val[23]" max="12:12:12" min="08:08:08" range/>
                    <pl-time-panel v-model:start="val[22]" v-model:end="val[23]" max="12:12:12" min="08:08:08" range/>
                </demo-row>
            </demo-row>
        </demo-row>

        <demo-row title="time service">
            <demo-row title="基本用法">
                <pl-button :label="basic.val || 'basic usage'" ref="basic" @click="basic.toggle()"/>
            </demo-row>
            <demo-row title="时间范围">
                <pl-button :label="range.start?`start:${range.start}, end:${range.end}`:'range usage'" ref="range" @click="range.toggle()"/>
            </demo-row>
        </demo-row>

    </div>
</template>

<script>
    import {zeroize} from "plain-utils/string/zeroize";
    import {TimeServiceGetter} from "../../../src/packages/time/servce/time-service";
    import {ref} from 'vue'

    export default {
        name: "demo-time",
        data() {

            const basic = (() => {
                const val = ref(null)
                let agent;
                return {
                    val,
                    toggle: () => {
                        if (!agent) {
                            agent = TimeServiceGetter(this)({
                                reference: () => this.$refs["basic"],
                                renderAttrs: () => ({
                                    modelValue: val.value,
                                    onChange: (v) => val.value = v
                                })
                            })
                        }
                        agent.toggle()
                    }
                }
            })();

            const range = (() => {
                const start = ref(null)
                const end = ref(null)
                let agent;
                return {
                    start,
                    end,
                    toggle: () => {
                        if (!agent) {
                            agent = TimeServiceGetter(this)({
                                reference: () => this.$refs["range"],
                                renderAttrs: () => ({
                                    start: start.value,
                                    end: end.value,
                                    range: true,
                                    onChange: (v, type) => {
                                        if (type === 'start') {
                                            start.value = v
                                        } else {
                                            end.value = v
                                        }
                                    }
                                })
                            })
                        }
                        agent.toggle()
                    }
                }
            })();

            return {
                basic,
                range,
                val: {
                    6: '20:15:10',

                    7: '12:12:12',
                    8: '08:08:08',
                    13: null,
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
                        this.val["12"] = `${zeroize(maxmm)}:${zeroize(maxss)}`
                    }
                    if (mm < minmm || (mm === minmm && ss < minss)) {
                        this.val["12"] = `${zeroize(minmm)}:${zeroize(minss)}`
                    }
                }
            },
            custom(layout, value) {

                let five = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
                let ten = [0, 10, 20, 30, 40, 50]

                if (layout === 'h') {
                    return [8, 9, 10, 11, 13, 15, 17]
                }
                if (layout === 'm') {
                    if (value.isNull) {
                        return []
                    }
                    return value.hour > 12 ? ten : five
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

                    const newValue = `${zeroize(HH)}:${zeroize(mm)}`
                    if (newValue !== value) {
                        this.val['13'] = newValue
                    }
                }
            },
        }
    }
</script>

<style lang="scss">

</style>