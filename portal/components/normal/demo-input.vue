<template>
    <div class="demo-input">
        <!--<im-demo-row title="基本用法">
            <im-input/>
        </im-demo-row>
        <im-demo-row title="鼠标悬浮的时候自动获取焦点">
            <im-input focusOnHover/>
        </im-demo-row>
        <im-demo-row title="类型">
            <im-input type="fill"/>
            <im-input type="line"/>
            <im-input type="none"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-input v-for="color in ['primary','success','warn','error','info','disabled']" :key="color" :color="color"/>
        </im-demo-row>
        <im-demo-row title="大小">
            <im-input size="large"/>
            <im-input size="default"/>
            <im-input size="small"/>
        </im-demo-row>
        <im-demo-row title="形状">
            <im-input shape="round"/>
            <im-input shape="fillet"/>
            <im-input shape="none"/>
        </im-demo-row>
        <im-demo-row title="输入框类型">
            <im-input inputType="password" :value="123456"/>
        </im-demo-row>
        <im-demo-row title="图标">
            <im-input icon="pl-date-fill"/>
        </im-demo-row>
        <im-demo-row title="自定义删除动作">
            <im-input icon="pl-down" @clear="$plain.log('clear')"/>
        </im-demo-row>
        <im-demo-row title="长输入框">
            <im-input long/>
        </im-demo-row>
        <im-demo-row title="加载中">
            <im-input loading type="fill"/>
            <im-input loading/>
            <im-input loading type="none"/>
        </im-demo-row>
        <im-demo-row title="节流以及回车等待">
            <im-input @enter="$plain.log('enter')"/>
            <im-input @enter="testWaiting"/>
        </im-demo-row>
        <im-demo-row title="键盘事件">
            <im-button-group>
                <im-button label="enter" type="line"/>
                <im-button label="space" type="line"/>
                <im-button label="esc" type="line"/>
                <im-button label="up" type="line"/>
                <im-button label="down" type="line"/>
                <im-button label="left" type="line"/>
                <im-button label="right" type="line"/>
            </im-button-group>
            <im-input
                    @enter="$plain.log('enter')"
                    @space="$plain.log('space')"
                    @esc="$plain.log('esc')"
                    @up="$plain.log('up')"
                    @down="$plain.log('down')"
                    @left="$plain.log('left')"
                    @right="$plain.log('right')"
            />
        </im-demo-row>
        <im-demo-row title="前置后置插槽">
            <im-input placeholder="">
                <div slot="prepend">http://</div>
                <div slot="append">.com</div>
            </im-input>
        </im-demo-row>-->
        <im-demo-row title="推荐输入">
            <im-input :suggestion="data.map(item=>item.name)" v-model="suggestVal"/>
            <span>{{suggestVal}}</span>
        </im-demo-row>
        <im-demo-row title="推荐输入，自定义渲染内容">
            <im-input :suggestion="data" suggestionLabelKey="name">
                <template v-slot:suggestion="{item,index}">
                    <div class="demo-input-suggestion">
                        <div class="demo-input-suggestion-title">{{item.name}}</div>
                        <div class="demo-input-suggestion-desc">{{item.desc}}</div>
                    </div>
                </template>
            </im-input>
        </im-demo-row>
        <im-demo-row title="推荐输入，自定义筛选逻辑">
            <im-input :suggestion="data" suggestionLabelKey="name" :suggestionFilter="suggestionFilter">
                <template v-slot:suggestion="{item,index}">
                    <div class="demo-input-suggestion">
                        <div class="demo-input-suggestion-title">{{item.name}}</div>
                        <div class="demo-input-suggestion-desc">{{item.desc}}</div>
                    </div>
                </template>
            </im-input>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-input",
        data() {
            return {
                suggestVal: null,
                data: [
                    {name: '湖南', desc: '金三角建材城', val: '1'},
                    {name: '湖北', desc: '中豪装饰城', val: '2'},
                    {name: '江西', desc: '红星美凯龙', val: '3'},
                    {name: '山东', desc: '大红房装饰城', val: '4'},
                    {name: '山西', desc: '红星美凯龙和平商场', val: '5'},
                    {name: '广西', desc: '红星美凯龙方北商场', val: '6'},
                    {name: '安徽', desc: '怀特装饰城', val: '7'},
                    {name: '河北', desc: '红房子家居广场', val: '8'},
                    {name: '河南', desc: '758陶瓷市场', val: '9'},
                    {name: '广东', desc: '好家居装饰城', val: '10'},
                ],
            }
        },
        methods: {
            async testWaiting() {
                await this.$plain.$utils.delay(2000)
                console.log('enter:', new Date().getTime())
            },
            suggestionFilter(item, val) {
                return item.name.indexOf(val) > -1 || item.desc.indexOf(val) > -1
            },
        }
    }
</script>

<style lang="scss">
    .demo-input {
        /*background-color: #3B731D;*/

    }

    .demo-input-suggestion {
        .demo-input-suggestion-title {
            font-size: 14px;
            color: #333;
        }

        .demo-input-suggestion-desc {
            font-size: 12px;
            color: #999;
        }
    }
</style>