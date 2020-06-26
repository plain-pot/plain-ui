<template>
    <div>
        <demo-row>
            <demo-line>
                <pl-button @click="changeValue">change value</pl-button>
                <pl-tag>
                    {{formatValue | plf}}
                </pl-tag>
                <pl-tag>
                    {{num}}
                </pl-tag>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>

    export default {
        name: "test-filter",
        filters: {
            plf: (() => {
                let counter = 0
                let map = new WeakMap()
                let data = window.Vue.observable({})

                return (val) => {

                    console.log('filter', counter)

                    if (!!val && !!val.then && typeof val.then === "function") {
                        let count = map.get(val)
                        if (count != null) {
                            return data[count]
                        } else {
                            count = ++counter
                            map.set(val, count)
                            window.Vue.prototype.$set(data, count, '加载中...')
                        }
                        val.then((asyncVal) => {
                            data[count] = asyncVal
                        })
                        return data[count]
                    }

                    return `plf-${val}`
                }
            })(),
        },
        data() {
            return {
                num: 123,
                formatValue: 123
            }
        },
        methods: {
            changeValue() {
                this.formatValue = new Promise(async (resolve) => {
                    await this.$plain.utils.delay(1000)
                    resolve(++this.num)
                })
            },
        }
    }
</script>

<style lang="scss">

</style>