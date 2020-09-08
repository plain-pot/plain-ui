<template>
    <div class="table-span">
        <demo-row title="合并行">
            <pl-table :data="data" :spanMethod="spanMethod" border>
                <plc-index/>
                <plc title="一级标题" field="first"/>
                <plc title="二级标题" field="second"/>
                <plc title="三级标题" field="third"/>
            </pl-table>
        </demo-row>
    </div>
</template>

<script>

    export default {
        name: "table-span.vue",
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

            data.forEach((item, index) => {

                const map = {
                    first: 1,
                    second: 1,
                    third: 1
                }

                if (index === 0) {
                    spanMap.push(map)
                    return
                }

                ['first', 'second', 'third'].forEach(key => {
                    if (item[key] === data[prevIndex[key]][key]) {
                        spanMap[prevIndex[key]][key]++
                        map[key] = 0
                    } else {
                        prevIndex[key] = index
                    }
                })

                spanMap.push(map)
            })

            console.log(JSON.parse(JSON.stringify(spanMap)))

            return {
                data,
                spanMap,
            }
        },
        methods: {
            spanMethod({tableNode, plc}) {
                return {
                    colspan: 1,
                    rowspan: this.spanMap[tableNode.index][plc.props.field],
                }
            },
        }
    }
</script>

<style lang="scss">

</style>