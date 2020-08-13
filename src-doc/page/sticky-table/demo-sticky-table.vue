<template>
    <div class="demo-sticky-table">
        <div class="link-table">
            <pl-scroll scrollX>
                <pl-scroll-sticky top="0" tag="table" class="link-table-head" :zIndex="2">
                    <thead>
                    <tr>
                        <component
                                v-for="col in columns"
                                :key="col.field"
                                :is="col.fixed?'pl-scroll-sticky':'td'"

                                v-bind="col.fixed?{
                                    tag:'td',
                                    [col.fixed]:0,
                                }:{}"
                                :style="{width:col.width,backgroundColor:col.fixed?'#f2f2f2':'white'}">
                            {{col.title}}
                        </component>
                    </tr>
                    </thead>
                </pl-scroll-sticky>
                <table>
                    <tbody>
                    <tr v-for="(data,index) in list" :key="index">
                        <component
                                v-for="col in columns"
                                :key="col.field"
                                :is="col.fixed?'pl-scroll-sticky':'td'"

                                v-bind="col.fixed?{
                                    tag:'td',
                                    [col.fixed]:0,
                                }:{}"
                                :style="{width:col.width,backgroundColor:col.fixed?'#f2f2f2':'white'}">
                            {{data[col.field]}}
                        </component>
                    </tr>
                    </tbody>
                </table>
            </pl-scroll>
        </div>
    </div>
</template>

<script>

    import list from '../data/data-1.json'

    export default {
        name: "demo-sticky-table",
        data() {
            return {
                list,
                columns: [
                    {field: 'name', title: 'name', width: '200px', fixed: 'left'},
                    {field: 'id', title: 'id', width: '200px'},
                    {field: 'size', title: 'size', width: '200px'},
                    {field: 'id', title: 'id', width: '200px'},
                    {field: 'date', title: 'date', width: '200px'},
                    {field: 'color', title: 'color', width: '200px'},
                    {field: 'star', title: 'star', width: '200px', fixed: 'right'},
                ],
            }
        },
    }
</script>

<style lang="scss">
    .link-table {
        height: 300px;
        width: 100%;
        overflow: hidden;

        table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            border-spacing: 0;
            box-sizing: border-box;
            list-style: none;
            z-index: 0;

            td {
                background-color: white;
                padding: 0 16px;
                box-sizing: border-box;
                height: 40px;

                &:not(.pl-scroll-sticky) {
                    position: relative;
                }

                &:after {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background-color: #ddd;
                    content: '';
                    transform: scaleY(0.5);
                }
            }
        }

        .pl-vertical-scrollbar-wrapper {
            z-index: 10;
        }
    }
</style>