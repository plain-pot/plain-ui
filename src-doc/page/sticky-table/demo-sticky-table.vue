<template>
    <div class="demo-sticky-table">
        <div class="link-table">
            <div class="link-table-head" @mouseenter="()=>hoverPart = 'head'">
                <pl-scroll scrollX
                           fitContentHeight
                           ref="headScroll"
                           @scroll="e=>onScroll(e,'head')">
                    <table class="link-table-head">
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
                    </table>
                </pl-scroll>
            </div>
            <div class="link-table-body" @mouseenter="()=>hoverPart = 'body'">
                <pl-scroll
                        scrollX
                        ref="bodyScroll"
                        @scroll="e=>onScroll(e,'body')"
                >
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
                hoverPart: null,
            }
        },
        methods: {
            onScroll(e, tag) {
                if (tag !== this.hoverPart) {
                    return
                }
                this.$refs[`${tag === 'head' ? 'body' : 'head'}Scroll`].methods.scrollLeft(e.target.scrollLeft)
            },
        }
    }
</script>

<style lang="scss">
    .link-table {
        width: 100%;

        .link-table-body {
            height: 300px;
            overflow: hidden;
        }

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