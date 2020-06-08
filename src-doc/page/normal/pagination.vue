<template>
    <div class="demo-pagination">
        <demo-row title="基本用法">
            <pl-pagination total="20000"
                           :pageSize="val[0].size"
                           :currentPage="val[0].current"
                           @current-change="page=>val[0].current = page"
                           @jump="page=>val[0].current = page"
                           @size-change="size=>val[0].size = size"
            />
            <div>{{val[0]}}</div>
        </demo-row>

        <demo-row title="大小尺寸">
            <demo-line title="large">
                <pl-pagination total="200"
                               :pageSize="val[1].size"
                               :currentPage="val[1].current"
                               @current-change="page=>val[1].current = page"
                               @jump="page=>val[1].current = page"
                               @size-change="size=>val[1].size = size"

                               size="large"/>
            </demo-line>
            <demo-line title=" ">
                <div>{{val[1]}}</div>
            </demo-line>
            <demo-line title="normal">
                <pl-pagination total="200"
                               :pageSize="val[2].size"
                               :currentPage="val[2].current"
                               @current-change="page=>val[2].current = page"
                               @jump="page=>val[2].current = page"
                               @size-change="size=>val[2].size = size"

                               size="normal"/>
            </demo-line>
            <demo-line title=" ">
                <div>{{val[2]}}</div>
            </demo-line>
            <demo-line title="large">
                <pl-pagination total="200"
                               :pageSize="val[3].size"
                               :currentPage="val[3].current"
                               @current-change="page=>val[3].current = page"
                               @jump="page=>val[3].current = page"
                               @size-change="size=>val[3].size = size"

                               size="mini"/>
            </demo-line>
            <demo-line title=" ">
                <div>{{val[3]}}</div>
            </demo-line>
        </demo-row>

        <demo-row title="页码折叠形式">
            <demo-line title="前后不折叠(总页数小于等于页码按钮个数)" labelWidth="250px">

                <pl-pagination totalPage="7"
                               :pageSize="val[4].size"
                               :currentPage="val[4].current"
                               @current-change="page=>val[4].current = page"
                               @jump="page=>val[4].current = page"
                               @size-change="size=>val[4].size = size"/>
            </demo-line>
            <demo-line title="前页折叠，当前页接近尾部位置" labelWidth="250px">
                <pl-pagination total="200"
                               :pageSize="val[5].size"
                               :currentPage="val[5].current"
                               @current-change="page=>val[5].current = page"
                               @jump="page=>val[5].current = page"
                               @size-change="size=>val[5].size = size"/>
            </demo-line>
            <demo-line title="后页折叠，当前页接近起始位置" labelWidth="250px">
                <pl-pagination total="200"
                               :pageSize="val[6].size"
                               :currentPage="val[6].current"
                               @current-change="page=>val[6].current = page"
                               @jump="page=>val[6].current = page"
                               @size-change="size=>val[6].size = size"/>
            </demo-line>
            <demo-line title="前后页折叠，当前页在中间位置" labelWidth="250px">
                <pl-pagination total="400"
                               :pageSize="val[7].size"
                               :currentPage="val[7].current"
                               @current-change="page=>val[7].current = page"
                               @jump="page=>val[7].current = page"
                               @size-change="size=>val[7].size = size"/>
            </demo-line>
        </demo-row>

        <demo-row title="自定义布局">
            <pl-pagination total="400"
                           :pageSize="val[8].size"
                           :currentPage="val[8].current"
                           @current-change="page=>val[8].current = page"
                           @jump="page=>val[8].current = page"
                           @size-change="size=>val[8].size = size"
                           layout="sizes,prev,next,pager,jumper,loading,blank,total,slot"/>
        </demo-row>
        <demo-row title="上下页文本">
            <pl-pagination total="400"
                           :pageSize="val[8].size"
                           :currentPage="val[8].current"

                           prevText="上一页"
                           nextText="下一页"

                           @current-change="page=>val[8].current = page"
                           @jump="page=>val[8].current = page"
                           @size-change="size=>val[8].size = size"/>
        </demo-row>
        <demo-row title="加载状态">
            <pl-pagination total="400"
                           :pageSize="val[9].size"
                           :currentPage="val[9].current"
                           loading
                           @current-change="page=>val[9].current = page"
                           @jump="page=>val[9].current = page"
                           @size-change="size=>val[9].size = size"/>
        </demo-row>
        <demo-row title="禁用">
            <pl-pagination total="400"
                           :pageSize="val[10].size"
                           :currentPage="val[10].current"
                           disabled
                           @current-change="page=>val[10].current = page"
                           @jump="page=>val[10].current = page"
                           @size-change="size=>val[10].size = size"/>
        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "pagination",
        props: {},
        data() {
            let val = []
            for (let i = 0; i < 20; i++) {
                val.push({
                    current: 1,
                    size: 20,
                })
            }
            val[5].current = 7
            val[6].current = 3
            val[7].current = 10

            return {
                val,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-pagination {

        width: 1060px;
        margin-left: -130px;

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