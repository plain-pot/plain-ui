<template>
    <div class="demo-popper">

        <demo-row title="基本用法">
            <pl-popper :width="null" :height="null">
                <pl-button label="hover激活"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
        </demo-row>

        <demo-row title="位置" class="demo-popper-placement">

            <demo-line v-for="direction in directions" :key="direction">

                <pl-popper :placement="direction" :key="`${direction}-1`">
                    <pl-button :label="direction"/>
                    <div slot="popper" class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </pl-popper>

                <pl-popper :placement="`${direction}-${align}`" :key="align" v-for="align in aligns">
                    <pl-button :label="`${direction}-${align}`"/>
                    <div slot="popper" class="demo-popper-content">
                        这里是popper的内容
                    </div>
                </pl-popper>
            </demo-line>
        </demo-row>

        <demo-row title="触发动作">
            <pl-popper trigger="hover">
                <pl-button label="hover激活"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper trigger="click">
                <pl-button label="click激活"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper trigger="manual" v-model="val[1]">
                <pl-button label="manual激活" @click="$set(val,1,!val[1])"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容{{val[1]}}
                </div>
            </pl-popper>
            <pl-popper trigger="focus">
                <pl-button label="focus激活"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper trigger="focus">
                <span>focus激活</span>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
        </demo-row>

        <demo-row title="测试组件销毁之后，监听的事件是否已经销毁">
            <pl-checkbox v-model="init" label="init"/>
            <pl-popper trigger="click" v-if="init" @click-body="onClickBody">
                <pl-button label="click激活"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
        </demo-row>

        <demo-row title="自定义reference" @change="$nextTick(()=>reference = $refs.button)">
            <pl-button label="click激活" ref="button"/>
            <pl-popper trigger="click" :reference="reference">
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
        </demo-row>

        <demo-row title="自动设置popper大小，在方向上与reference大小对其">
            <pl-popper placement="top" sizeEqual>
                <pl-button label="纵向" style="width:100px;height: 100px"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper placement="left" sizeEqual>
                <pl-button label="横向" style="width:100px;height: 100px"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
        </demo-row>

        <demo-row title="动画">
            <pl-popper transition="pl-transition-fade" trigger="click">
                <pl-button label="fade"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper transition="pl-transition-scale" trigger="click">
                <pl-button label="scale"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper transition="pl-transition-scale-y" trigger="click">
                <pl-button label="scale-y"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper transition="pl-transition-popper-drop" trigger="click" :arrow="false" placement="bottom-start">
                <pl-button label="popper-drop"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
        </demo-row>

        <demo-row>
            <div>flag:{{flag}}</div>
            <div>open:{{open}}</div>
            <pl-checkbox label="open" v-model="flag"/>

            <pl-popper transition="pl-transition-scale-y"
                       trigger="click"
                       v-model="flag"
                       @input="val=>$plain.log('111',val)"
                       :open.sync="open"
                       @open="$plain.log('open')"
                       @close="$plain.log('close')"
            >
                <pl-button label="scale-y"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
        </demo-row>

        <demo-row title="综合测试">
            <demo-line title="测试目标" style="height: 100px">
                <pl-popper :transition="test.animation" trigger="manual" :arrow="test.arrow" :placement="`${test.direction}-${test.align}`" :value="test.show">
                    <pl-button label="popper-drop" @click="test.show = !test.show"/>
                    <div slot="popper" class="demo-popper-content">
                        这里是popper的内容
                    </div>
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
                <pl-checkbox v-model="test.arrow"/>
            </demo-line>

        </demo-row>

        <demo-row title="宽高">
            <pl-popper :width="150" :height="200" trigger="click">
                <pl-button label="150:number,200:number"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper width="150px" height="200" trigger="click">
                <pl-button label="150px:string,200:string"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../../component/DemoMixins";

    export default {
        name: "demo-popper",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {
                init: false,
                reference: null,
                flag: false,
                open: false,

                test: {
                    show: true,
                    direction: 'bottom',
                    align: 'start',
                    arrow: false,
                    animation: 'pl-transition-popper-drop',
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
        mounted() {
            this.reference = this.$refs.button
        },
        methods: {
            onClickBody() {
                console.log('onClickBody')
            },
        },
    }
</script>

<style lang="scss">
    .demo-popper-placement {
        .app-demo-row-content {
            width: 420px;
        }

        .r-button {
            margin-bottom: 12px;
            height: 80px !important;
            width: 80px;
        }
    }
</style>