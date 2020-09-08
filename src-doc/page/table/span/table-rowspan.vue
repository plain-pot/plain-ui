<template>
    <div class="table-rowspan">
        <demo-line title="字段值相同则合并行"/>
        <ul>
            <li v-for="item in data">
                {{item}}
            </li>
        </ul>
        <pl-table :data="data" :spanMethod="spanMethod" border>
            <plc-index/>
            <plc title="一级标题" field="first"/>
            <plc title="二级标题" field="second"/>
            <plc title="三级标题" field="third"/>
        </pl-table>
    </div>
</template>

<script>

    export default {
        name: "table-rowspan",
        data() {

            const data = [
                {first: '1', second: '1-1', third: '1-1-1'},
                {first: '1', second: '1-1', third: '1-1-2'},
                {first: '1', second: '1-1', third: '1-1-3'},
                {first: '1', second: '1-2', third: '1-2-1'},
                {first: '1', second: '1-3', third: '1-3-1'},
                {first: '2', second: '2-1', third: '2-1-1'},
                {first: '2', second: '2-1', third: '2-1-2'},
                {first: '2', second: '2-2', third: '2-2-1'},
            ]

            const prevIndex = {
                first: 0,
                second: 0,
                third: 0,
            }

            const spanMap = []
            const collapseField = ['first', 'second']
            const initMap = collapseField.reduce((ret, item) => {
                ret[item] = 1
                return ret
            }, {})

            data.forEach((item, index) => {

                const map = {...initMap}

                if (index === 0) {
                    spanMap.push(map)
                    return
                }

                collapseField.forEach(key => {
                    if (item[key] === data[prevIndex[key]][key]) {
                        spanMap[prevIndex[key]][key]++
                        map[key] = 0
                    } else {
                        prevIndex[key] = index
                    }
                })

                spanMap.push(map)
            })

            // console.log(JSON.parse(JSON.stringify(spanMap)))

            return {
                data,
                spanMap,
            }
        },
        methods: {
            spanMethod({tableNode, plc}) {
                return {
                    colspan: 1,
                    rowspan: this.spanMap[tableNode.index][plc.props.field] != null ? this.spanMap[tableNode.index][plc.props.field] : 1,
                }
            },
        }
    }
</script>

<style lang="scss">

</style>