<template>
    <div class="demo-pagination">
        <demo-row title="基本用法">
            <pl-pagination pageSize="20" currentPage="1" total="141"/>
        </demo-row>

        <demo-row title="大小尺寸">
            <demo-line title="large">
                <pl-pagination pageSize="20" currentPage="1" size="large" total="200"/>
            </demo-line>
            <demo-line title="normal">
                <pl-pagination pageSize="20" currentPage="1" size="normal" total="200"/>
            </demo-line>
            <demo-line title="large">
                <pl-pagination pageSize="20" currentPage="1" size="mini" total="200"/>
            </demo-line>
        </demo-row>

        <demo-row title="形式">
            <demo-line title="前后不折叠(总页数小于等于页码按钮个数)" labelWidth="250px">
                <pl-pagination pageSize="20" totalPage="7" currentPage="1" pagerCount="7"/>
            </demo-line>
            <demo-line title="前页折叠，当前页接近尾部位置" labelWidth="250px">
                <pl-pagination pageSize="20" totalPage="10" currentPage="7" pagerCount="7"/>
            </demo-line>
            <demo-line title="后页折叠，当前页接近起始位置" labelWidth="250px">
                <pl-pagination pageSize="20" totalPage="10" currentPage="3" pagerCount="7"/>
            </demo-line>
            <demo-line title="前后页折叠，当前页在中间位置" labelWidth="250px">
                <pl-pagination pageSize="20" totalPage="20" currentPage="10" pagerCount="7"/>
            </demo-line>
        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "pagination",
        props: {},
        data() {
            return {}
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