<template>
    <div class="demo-base-table-dynamic">
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

        <im-base-table ref="table" :data="data" id="trainno" @dblclickRow="pl_dblclick" :showNum="5">
            <im-tc-input title="类型" field="type" :prop="{color:'success'}"/>
            <im-tc-input title="车次" field="trainno"/>
            <im-tc-input title="用时" field="costtime"/>
            <im-tc-input title="出发站" field="station"/>
            <im-tc-input title="到达站" field="endstation"/>
            <im-tc-input title="出发时间" field="departuretime"/>
            <im-tc-input title="到达时间" field="arrivaltime"/>
            <im-tc-column title="顺序" field="sequenceno"/>
            <im-tc-column title="用时" field="costtime"/>
            <im-tc-column title="距离" field="distance"/>
            <im-tc-column title="是否终点" field="isend"/>
            <im-tc-column title="商务座票价" field="pricesw"/>
            <im-tc-column title="特等座票价" field="pricetd"/>
            <im-tc-column title="高级软卧上票价" field="pricegr1"/>
            <im-tc-column title="高级软卧下票价" field="pricegr2"/>
        </im-base-table>
    </div>
</template>

<script>

    import {TableData} from "../../data";

    export default {
        name: "demo-base-table-dynamic",
        data() {
            return {
                data: TableData,

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
        }
    }
</script>

<style lang="scss">
    .demo-base-table-dynamic {
        box-sizing: border-box;
        padding: 16px;
    }
</style>