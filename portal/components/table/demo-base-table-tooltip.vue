<template>
    <div class="demo-base-table-tooltip">
        <im-demo-row title="基本编辑功能">
            <im-demo-row-item>
                <im-button-group>
                    <im-button label="状态：" type="line"/>
                    <im-button v-for="(item,index) in Object.keys(EDIT_STATUS)" :label="item" :active="EDIT_STATUS[item] === status" :key="index"/>
                </im-button-group>
            </im-demo-row-item>
            <im-demo-row-item>
                <im-button-group>
                    <im-button @click="add" label="添加"/>
                    <im-button @click="cancel" label="取消"/>
                    <im-button @click="save" label="保存"/>
                    <im-button @click="multiUpdate" label="批量编辑"/>
                </im-button-group>
                <im-input v-model="index"/>
            </im-demo-row-item>
        </im-demo-row>

        <im-base-table ref="table" :data="data" id="trainno" @dblclickRow="pl_dblclick">
            <im-tc-column title="非常非常非常非常长非常非常长的标题" field="tooltip" tooltip/>
            <im-tc-column title="formatter+tooltip" field="tooltip" tooltip :formatter="formatter"/>
            <im-tc-column title="formatter+sync tooltip" field="type" tooltip :formatter="formatterSync"/>
            <im-tc-select title="状态" field="status" :prop="selectProp" tooltip/>

            <im-tc-column title="车次" field="trainno"/>
            <im-tc-column title="用时" field="costtime"/>
            <im-tc-column title="出发站" field="station"/>
        </im-base-table>
    </div>
</template>

<script>

    import {TableData} from "../../data";

    export default {
        name: "demo-base-table-tooltip",
        data() {

            const data = TableData
            data.forEach(item => {
                item.tooltip = this.$plain.$utils.uuid()
            })
            return {
                data,

                EDIT_STATUS: {
                    INSERT: 'insert',
                    UPDATE: 'update',
                    NORMAL: 'normal',
                    SELECT: 'select',
                    MULTI_UPDATE: 'multiUpdate',
                },
                status: 'normal',
                newData: [],
                table: null,
                index: null,

                selectProp: {
                    data: [
                        {name: '新建', val: 'new'},
                        {name: '已提交', val: 'submit'},
                        {name: '已审批', val: 'accept'},
                        {name: '已拒绝', val: 'reject'},
                    ],
                    labelKey: 'name',
                    valueKey: 'val',
                },
            }
        },
        mounted() {
            this.table = this.$refs.table
        },
        methods: {
            /**
             * 工具函数，判断当前状态
             * @author  韦胜健
             * @date    2019/1/9 11:12
             */
            async pl_checkStatus({insert, update, normal, select, multiUpdate, final}) {
                const param = {insert, update, normal, select, multiUpdate, final}
                let {[this.status]: h, final: f} = param
                !!h && await h.apply(this)
                !!f && f.apply(this)
            },
            /*
             *  处理双击行事件，双击编辑行
             *  @author     martsforever
             *  @datetime   2019/5/25 21:07
             */
            pl_dblclick({item}) {
                this.pl_checkStatus({
                    normal() {
                        this.table.enableEdit({item})
                        this.status = this.EDIT_STATUS.UPDATE
                    },
                })
            },
            /*
             *  添加行
             *  @author     martsforever
             *  @datetime   2019/5/25 21:08
             */
            add() {
                this.pl_checkStatus({
                    async normal() {
                        const newRow = {
                            "trainno": new Date().getTime(),
                            "type": "G",
                            "station": "杭州东",
                            "endstation": "北京南",
                            "departuretime": "06:55",
                            "arrivaltime": "13:03",
                            "sequenceno": "1",
                            "costtime": "6时8分",
                            "distance": "0",
                            "isend": "1",
                            "trainno12306": "5600000G3490",
                            "pricesw": "1701",
                            "typename": "高铁",
                            "priceyd": "907.0",
                            "priceed": "538.5"
                        }
                        this.newData.unshift(newRow)
                        this.data.unshift(newRow)
                        await this.$plain.nextTick()
                        this.table.enableEdit({index: 0})
                        this.status = this.EDIT_STATUS.INSERT
                    },
                })
            },
            /*
             *  取消编辑
             *  @author     martsforever
             *  @datetime   2019/5/25 21:08
             */
            cancel() {
                this.pl_checkStatus({
                    insert() {
                        while (this.newData.length > 0) {
                            this.newData.shift()
                            this.data.shift()
                        }
                    },
                    update() {
                        this.table.cancelEdit({index: this.index})
                        this.table.disableEdit({index: this.index})
                    },
                    multiUpdate() {
                        console.log('cancel multiUpdate')
                        this.table.cancelEdit()
                        this.table.disableEdit()
                    },
                    final() {
                        this.status = this.EDIT_STATUS.NORMAL
                    },
                })
            },
            /*
             *  保存编辑
             *  @author     martsforever
             *  @datetime   2019/5/25 21:09
             */
            save() {
                this.pl_checkStatus({
                    insert() {
                        for (let i = 0; i < this.newData.length; i++) {
                            this.table.saveEdit({index: i})
                            this.table.disableEdit({index: i})
                        }
                        this.newData = []
                    },
                    update() {
                        this.table.saveEdit({index: this.index})
                        this.table.disableEdit({index: this.index})
                        this.status = this.EDIT_STATUS.NORMAL
                    },
                    multiUpdate() {
                        this.table.saveEdit()
                        this.table.disableEdit()
                    },
                    final() {
                        this.status = this.EDIT_STATUS.NORMAL
                    },
                })
            },
            /*
             *  启用批量编辑
             *  @author     martsforever
             *  @datetime   2019/5/25 21:10
             */
            multiUpdate() {
                this.pl_checkStatus({
                    normal() {
                        this.table.enableEdit()
                        this.status = this.EDIT_STATUS.MULTI_UPDATE
                    },
                })
            },

            formatter({value}) {
                return `hello, ${value}`
            },
            async formatterSync({value}) {
                const delay = (Math.random() * 3000).toFixed(0)
                await this.$plain.$utils.delay(delay)
                return `${value},delay:${delay}`
            },
        }
    }
</script>

<style lang="scss">
    .demo-base-table-tooltip {
        box-sizing: border-box;
        padding: 16px;
    }
</style>