<template>
    <div class="demo-tree">
        <im-demo-row title="基本用法">
        </im-demo-row>
        <div class="demo-tree-wrapper">
            <im-tree :data="cities" label-key="name" children-key="children"/>
        </div>
        <im-demo-row title="设置树的宽度，以及横向可滚动显示">
        </im-demo-row>
        <div class="demo-tree-wrapper">
            <im-tree :data="cities" label-key="name" children-key="children" :width="200" scroll-x/>
        </div>
        <im-demo-row title="打开节点之后自动关闭兄弟节点">
        </im-demo-row>
        <div class="demo-tree-wrapper" style="height: 300px">
            <im-tree :data="cities" label-key="name" children-key="children" auto-close/>
        </div>
        <im-demo-row title="设置无内容时显示的文本">
        </im-demo-row>
        <div class="demo-tree-wrapper">
            <im-tree :data="cities" label-key="name" children-key="children" empty-text="空空如也"/>
        </div>
        <im-demo-row title="取消点击内容时展开|关闭子节点，只能点击展开|收起图标才能展开收起子节点">
        </im-demo-row>
        <div class="demo-tree-wrapper">
            <im-tree :data="cities" label-key="name" children-key="children" :toggle-on-click-content="false"/>
        </div>
        <im-demo-row title="取消懒初始化功能，一开始就初始化所有节点">
        </im-demo-row>
        <div class="demo-tree-wrapper">
            <im-tree :data="cities" label-key="name" children-key="children" :initialized-after-open="false"/>
        </div>
        <im-demo-row title="复选框功能">
            <im-button-group>
                <im-button @click="getCheckData">获取选中的节点（默认：格式化为一维数组结构数据）</im-button>
                <im-button @click="getCheckDataToTree">获取选中的节点（格式化为树形结构数据）</im-button>
            </im-button-group>
        </im-demo-row>
        <div class="demo-tree-wrapper" style="height:300px">
            <im-tree :data="cities"
                       label-key="name"
                       children-key="children"
                       @open="val=>$message.show('open:'+val.name)"
                       @close="val=>$message.show('close:'+val.name)"
                       checkbox
                       check-key="_check"
                       ref="tree1"/>
        </div>

        <im-demo-row title="一些操作函数以及监听函数">
            <im-button-group>
                <im-button @click="openSpecific">打开特定节点</im-button>
                <im-button @click="closeSpecific">关闭特定节点</im-button>
                <im-button @click="checkSpecific">选中特定节点</im-button>
                <im-button @click="uncheckSpecific">取消选中特定节点</im-button>
            </im-button-group>
        </im-demo-row>

        <div class="demo-tree-wrapper" style="height: 300px;">
            <im-tree :data="cities"
                       label-key="name"
                       children-key="children"
                       ref="tree"
                       checkbox
                       check-key="_check"
                       @close="data=>$message.show('close:'+data.name)"
                       @open="data=>$message.show('open:'+data.name)"/>
        </div>

        <im-demo-row title="自定义渲染内容">
        </im-demo-row>
        <div class="demo-tree-wrapper">
            <im-tree :data="cities" label-key="name" children-key="children">
                <template slot-scope="{data}">
                    hello, {{data.name}}
                </template>
            </im-tree>
        </div>
    </div>
</template>

<script>
    export default {
        name: "demo-tree",
        data() {
            return {
                cities: [
                    {
                        name: '广东省', children: [
                            {
                                name: '广州市', children: [
                                    {name: '番禺区',},
                                    {name: '天河区',},
                                    {name: '越秀区',},
                                ]
                            },
                            {name: '深圳市'},
                            {name: '佛山市'},
                        ]
                    },
                    {
                        name: '广西省', children: [
                            {
                                name: '南宁市', children: [
                                    {name: '兴宁区',},
                                    {name: '青秀区',},
                                    {name: '江南区',},
                                ]
                            },
                            {name: '柳州市'},
                            {name: '桂林市'},
                        ]
                    },
                ]
            }
        },
        methods: {
            async openSpecific() {
                this.$refs.tree.open(this.cities[0].children[0].children[2])
            },
            async closeSpecific() {
                this.$refs.tree.close(this.cities[0].children[0].children[2])
            },
            checkSpecific() {
                this.$refs.tree.check(this.cities[0].children[0].children[2])
            },
            uncheckSpecific() {
                this.$refs.tree.uncheck(this.cities[0])
            },
            getCheckData() {
                const result = this.$refs.tree1.getCheckData()
                console.log(result)
                this.$dialog.show(JSON.stringify(result), {width: 500})
            },
            getCheckDataToTree() {
                const result = this.$refs.tree1.getCheckData(false)
                console.log(result)
                this.$dialog.show(JSON.stringify(result), {width: 500})
            },
        }
    }
</script>

<style lang="scss">
    .demo-tree {
        .demo-tree-wrapper {
            height: 150px;
            margin-left: 20px;
        }
    }
</style>