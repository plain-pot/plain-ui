<template>
    <div class="demo-popper">
        <demo-row title="基本用法">
            <pl-popper title="标题" message="消息文本">
                <span>默认hover显示</span>
            </pl-popper>
            <pl-popper title="标题" message="消息文本">
                <pl-button mode="text">默认hover显示</pl-button>
            </pl-popper>
            <pl-popper>
                <span>自定义内容</span>
                <template #title>
                    <span>自定义标题</span>
                    <pl-icon icon="el-icon-info"/>
                </template>
                <template #popper>
                    <p>popper content 111</p>
                    <p>popper content 222</p>
                </template>
            </pl-popper>
            <pl-popper title="标题" message="消息文本" placement="bottom">
                <pl-icon icon="el-icon-info"/>
            </pl-popper>
        </demo-row>

        <demo-row title="位置" class="demo-popper-placement">
            <demo-line v-for="direction in directions" :key="direction">
                <pl-button-group>
                    <pl-popper :placement="direction" :key="`${direction}-1`">
                        <pl-button :label="direction"/>
                        <template #popper>
                            <div class="demo-popper-content">
                                这里是popper的内容
                            </div>
                        </template>
                    </pl-popper>
                    <pl-popper :placement="`${direction}-${align}`" :key="align" v-for="align in aligns">
                        <pl-button :label="`${direction}-${align}`"/>
                        <template #popper>
                            <div class="demo-popper-content">
                                这里是popper的内容
                            </div>
                        </template>
                    </pl-popper>
                </pl-button-group>
            </demo-line>
        </demo-row>

        <demo-row title="触发动作">
            <demo-line>
                <pl-checkbox label="禁用" v-model="disabledPopper"/>
            </demo-line>
            <pl-popper trigger="hover" :disabled="disabledPopper">
                <pl-button label="hover激活"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
            <pl-popper trigger="click" :disabled="disabledPopper">
                <pl-button label="click激活"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
            <pl-popper trigger="manual" v-model="val[1]" :disabled="disabledPopper">
                <pl-button label="manual激活" @click="val = {...val,1:!val[1]}"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容{{val[1]}}
                    </div>
                </template>
            </pl-popper>
            <pl-popper trigger="focus" :disabled="disabledPopper">
                <pl-button label="focus激活"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
            <pl-popper trigger="focus" :disabled="disabledPopper">
                <span>focus激活</span>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
        </demo-row>

        <demo-row title="测试组件销毁之后，监听的事件是否已经销毁">
            <pl-checkbox v-model="init" label="init"/>
            <pl-popper trigger="click" v-if="init" @click-body="clickHandler">
                <pl-button label="click激活"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
        </demo-row>

        <demo-row title="自定义reference" @change="reference = () => $refs.button">
            <pl-button label="放在Popper之外的Reference" ref="button"/>
            <pl-popper trigger="click" :reference="reference">
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
        </demo-row>

        <demo-row title="自动设置popper大小，在方向上与reference大小对其">
            <pl-popper placement="top" sizeEqual>
                <pl-button label="纵向" style="width:100px;height: 100px"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
            <pl-popper placement="left" sizeEqual>
                <pl-button label="横向" style="width:100px;height: 100px"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
        </demo-row>

        <demo-row title="动画">
            <pl-popper transition="pl-transition-fade" trigger="click">
                <pl-button label="fade"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
            <pl-popper transition="pl-transition-scale" trigger="click">
                <pl-button label="scale"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
            <pl-popper transition="pl-transition-scale-y" trigger="click">
                <pl-button label="scale-y"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
            <pl-popper transition="pl-transition-popper-drop" trigger="click" :arrow="false" placement="bottom-start">
                <pl-button label="popper-drop"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
        </demo-row>

        <demo-row title="测试show以及open的区别">
            <div>flag:{{flag}}</div>
            <div>open:{{open}}</div>
            <pl-checkbox label="open" v-model="flag"/>

            <pl-popper transition="pl-transition-scale-y"
                       trigger="click"
                       v-model="flag"
                       @change="val=>log('111',val)"
                       v-model:open="open"
                       @open="log('open')"
                       @close="log('close')"
            >
                <pl-button label="scale-y"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
        </demo-row>

        <demo-row title="综合测试">
            <demo-line title="测试目标" style="height: 100px">
                <pl-popper :transition="test.animation" trigger="manual" :arrow="test.arrow" :placement="`${test.direction}-${test.align}`" v-model="test.show">
                    <pl-button label="popper-drop" @click="test.show = !test.show"/>
                    <template #popper>
                        <div class="demo-popper-content">
                            这里是popper的内容
                        </div>
                    </template>
                </pl-popper>
            </demo-line>
            <demo-line title="direction">
                <pl-button-group>
                    <pl-button v-for="item in directions" :key="item" :label="item" :active="item === test.direction" @click="test.direction = item"/>
                </pl-button-group>
            </demo-line>
            <demo-line title="align">
                <pl-button-group>
                    <pl-button v-for="item in aligns" :key="item" :label="item" :active="item === test.align" @click="test.align = item"/>
                </pl-button-group>
            </demo-line>
            <demo-line title="animation">
                <pl-button-group>
                    <pl-button v-for="item in animations" :key="item" :label="item" :active="item === test.animation" @click="test.animation = item"/>
                </pl-button-group>
            </demo-line>
            <demo-line title="arrow">
                <pl-checkbox v-model="test.arrow" label="show arrow"/>
            </demo-line>

        </demo-row>

        <demo-row title="宽高">
            <pl-popper :width="150" :height="200" trigger="click">
                <pl-button label="150:number,200:number"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
            <pl-popper width="150px" height="200" trigger="click">
                <pl-button label="150px:string,200:string"/>
                <template #popper>
                    <div class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </template>
            </pl-popper>
        </demo-row>

        <demo-row title="配置内置的滚动条">
            <i>只有设置height时才会使用Scroll容器</i>
            <pl-popper
                    noContentPadding
                    height="100"
                    trigger="click">
                <span>CLICK(无标题)</span>
                <template #popper>
                    <ol style="margin: 0;padding:0 16px;padding-inline-start: 28px;padding-inline-end: 0">
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                    </ol>
                </template>
            </pl-popper>
            <pl-popper title="标题"
                       noContentPadding
                       height="100"
                       trigger="click"
            >
                <span>CLICK</span>
                <template #popper>
                    <ol style="margin: 0;padding:0 16px;padding-inline-start: 28px;padding-inline-end: 0">
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                        <li>消息内容</li>
                    </ol>
                </template>
            </pl-popper>
        </demo-row>

    </div>
</template>

<script>

    export default {
        name: "popper",
        data() {
            return {
                init: false,
                reference: null,
                flag: false,
                open: false,
                disabledPopper: false,
                test: {
                    show: true,
                    direction: 'bottom',
                    align: 'start',
                    arrow: false,
                    animation: 'pl-transition-popper-drop',
                },
                val: {
                    0: true,
                },
                directions: ['top', 'bottom', 'left', 'right'],
                aligns: ['start', 'center', 'end'],
                animations: [
                    'pl-transition-fade',
                    'pl-transition-scale',
                    'pl-transition-scale-y',
                    'pl-transition-popper-drop',
                ],
            }
        },
        methods: {
            clickHandler() {
                console.log('onClickBody:' + Date.now())
            },
            log(...args) {
                console.log(...args)
            },
        },
        mounted() {
            this.reference = () => this.$refs.button
        },
    }
</script>

<style lang="scss">
    .demo-group {
    }

    .demo-popper-content {
        height: 55px;
    }
</style>