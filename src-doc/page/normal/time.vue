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
    </div>
</template>

<script>
    export default {
        name: "demo-time",
        props: {},
        data() {
            return {
                val: {},

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
        methods: {},
    }
</script>

<style lang="scss">
</style>