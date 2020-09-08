<template>
    <div class="table-colspan">
        <demo-line title="字段值相同则合并列"/>
        <ul>
            <li v-for="item in data">
                {{item}}
            </li>
        </ul>
        <pl-table :data="data" :spanMethod="spanMethod" border>
            <plc-index/>
            <plc title="产品线" field="name"/>
            <plc title="第一季度盈亏" field="first"/>
            <plc title="第二季度盈亏" field="second"/>
            <plc title="第三季度盈亏" field="third"/>
            <plc title="第四季度盈亏" field="fourth"/>
        </pl-table>
    </div>
</template>

<script>
    export default {
        name: "table-colspan",
        data() {

            const data = [
                {name: '产品线A', first: '盈利', second: '盈利', third: '亏损', fourth: '亏损',},
                {name: '产品线B', first: '盈利', second: '亏损', third: '亏损', fourth: '亏损',},
                {name: '产品线C', first: '盈利', second: '盈利', third: '盈利', fourth: '亏损',},
                {name: '产品线D', first: '亏损', second: '亏损', third: '亏损', fourth: '亏损',},
                {name: '产品线E', first: '盈利', second: '盈利', third: '盈利', fourth: '盈利',},
            ]

            const spanMap = []
            const collapseFields = ['first', 'second', 'third', 'fourth']

            data.forEach(item => {
                const map = {}
                let prevField = null
                collapseFields.forEach((field, fieldIndex) => {
                    if (fieldIndex === 0) {
                        prevField = field
                        map[field] = 1
                        return
                    }

                    if (item[prevField] === item[field]) {
                        map[field] = 0
                        map[prevField]++
                    } else {
                        map[field] = 1
                        prevField = field
                    }

                })
                spanMap.push(map)
            })

            console.log(JSON.parse(JSON.stringify(spanMap)))

            return {
                data,
                spanMap,
                spanMethod: ({tableNode, plc}) => {

                    const {field} = plc.props

                    if (field === 'name') {
                        return {
                            rowspan: 1,
                            colspan: 1,
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: this.spanMap[tableNode.index][field]
                        }
                    }
                }
            }
        },
    }
</script>

<style lang="scss">

</style>