<template>
    <div class="demo-sticky-table">
        <div class="link-table">
            <pl-scroll scrollX>
                <table class="link-table-head">
                    <thead>
                    <tr>
                        <td v-for="col in columns" :key="col.field" :style="{
                            width:col.width,
                            position:col.fixed === 'left'?'sticky':null,
                            left:col.left||'0',
                            zIndex:!!col.fixed?1:0,
                            backgroundColor:col.fixed?'#f2f2f2':'white'
                        }">
                            <div>
                                {{col.title}}
                            </div>
                        </td>
                    </tr>
                    </thead>
                </table>
                <table>
                    <tbody>
                    <tr v-for="(data,index) in list" :key="index">
                        <td v-for="col in columns" :key="col.field" :style="{
                           width:col.width,
                            position:col.fixed === 'left'?'sticky':null,
                            left:col.left||'0',
                            zIndex:!!col.fixed?1:0,
                            backgroundColor:col.fixed?'#f6f6f6':'white'
                        }">
                            <div>
                                {{data[col.field]}}
                            </div>
                        </td>
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
                    {field: 'size', title: 'size', width: '200px', fixed: 'left', left: '200px'},
                    {field: 'id', title: 'id', width: '200px'},
                    {field: 'date', title: 'date', width: '200px'},
                    {field: 'color', title: 'color', width: '200px'},
                    {field: 'star', title: 'star', width: '200px'},
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
            position: relative;

            td {
                background-color: white;
                padding: 0 16px;
                box-sizing: border-box;
                height: 40px;
                position: relative;

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

        .link-table-head {
            position: sticky;
            top: 0;
            z-index: 2;
        }

        .pl-vertical-scrollbar-wrapper {
            z-index: 10;
        }
    }
</style>