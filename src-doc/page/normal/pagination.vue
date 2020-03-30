<template>
    <div class="demo-pagination">
        <demo-row title="基本用法">
            <pl-pagination pageSize="20" :currentPage="val[0]" total="141" @jump="page=>val[0] = page"/>
        </demo-row>

        <demo-row title="大小尺寸">
            <demo-line title="large">
                <pl-pagination pageSize="20" :currentPage="val[1]" size="large" total="200" @jump="page=>val[1] = page"/>
            </demo-line>
            <demo-line title="normal">
                <pl-pagination pageSize="20" :currentPage="val[2]" size="normal" total="200" @jump="page=>val[2] = page"/>
            </demo-line>
            <demo-line title="large">
                <pl-pagination pageSize="20" :currentPage="val[3]" size="mini" total="200" @jump="page=>val[3] = page"/>
            </demo-line>
        </demo-row>

        <demo-row title="形式">
            <demo-line title="前后不折叠(总页数小于等于页码按钮个数)" labelWidth="250px">
                <pl-pagination pageSize="20" totalPage="7" :currentPage="val[4]" pagerCount="7" @jump="page=>val[4] = page"/>
            </demo-line>
            <demo-line title="前页折叠，当前页接近尾部位置" labelWidth="250px">
                <pl-pagination pageSize="20" totalPage="10" :currentPage="val[5]" pagerCount="7" @jump="page=>val[5] = page"/>
            </demo-line>
            <demo-line title="后页折叠，当前页接近起始位置" labelWidth="250px">
                <pl-pagination pageSize="20" totalPage="10" :currentPage="val[6]" pagerCount="7" @jump="page=>val[6] = page"/>
            </demo-line>
            <demo-line title="前后页折叠，当前页在中间位置" labelWidth="250px">
                <pl-pagination pageSize="20" totalPage="20" :currentPage="val[7]" pagerCount="7" @jump="page=>val[7] = page"/>
            </demo-line>
        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "pagination",
        props: {},
        data() {
            return {
                val: {
                    0: 1,
                    1: 1,
                    2: 1,
                    3: 1,
                    4: 1,
                    5: 7,
                    6: 3,
                    7: 10,
                    8: 1,
                    9: 1,
                    10: 1,
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-pagination {
        .demo-line {
            display: flex;
            align-items: center;

            .demo-line-title {
                white-space: pre-wrap;
            }

            .demo-line-content {
                flex: 1;
            }
        }
    }
</style>