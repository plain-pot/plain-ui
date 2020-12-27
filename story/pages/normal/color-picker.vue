<template>
    <div class="color-picker">
        <demo-row title="ColorAlphaSlider">
            <pl-color-alpha-slider v-model="val[0]" color="black" size="180"/>
            {{val[0]}}
        </demo-row>
        <demo-row title="ColorHueSlider">
            <pl-color-hue-slider v-model="val[1]" size="240"/>
            {{val[1]}}
        </demo-row>
        <demo-row title="ColorPanel:基本用法">
            <div :style="`background-color:${color1};width:100px;height:30px`">
                {{color1}}
            </div>
            <pl-color-panel v-model="color1" format="hex"/>
        </demo-row>
        <demo-row title="ColorPanel:透明度">
            <div :style="`background-color:${color2};width:100px;height:30px`">
                {{color2}}
            </div>
            <demo-line>
                <demo-line>{{color2}}</demo-line>
                <demo-line>
                    <pl-color-panel v-model="color2" enableAlpha format="rgb"/>
                </demo-line>
            </demo-line>
        </demo-row>
        <demo-row title="$colorPicker" group>
            <demo-row title="基本用法">
                <pl-button @click="serviceBasicUsage.toggle" label="颜色选择服务基本用法" ref="serviceBasicUsage"/>
            </demo-row>
            <demo-row title="不同格式的颜色值">
                <pl-button @click="hexValue.toggle" label="hex初始值" ref="hexValue"/>
                <pl-button @click="rgbValue.toggle" label="rgb初始值" ref="rgbValue"/>
                <pl-button @click="rgbWithoutOpacity.toggle" label="rgba初始值（不开启透明度）" ref="rgbWithoutOpacity"/>
                <pl-button @click="hexWithOpacity.toggle" label="hex（开启透明度）" ref="hexWithOpacity"/>
                <pl-button @click="rgbaWithOpacity.toggle" label="rgba（开启透明度）" ref="rgbaWithOpacity"/>
            </demo-row>
            <demo-row title="缓存值">
                <pl-button label="缓存值" @click="saveValue.toggle" ref="saveValue"/>
            </demo-row>
        </demo-row>
        <demo-row title="ColorPicker">
            <pl-color-picker v-model="val[3]"/>
            <pl-color-picker v-model="val[3]" @focus="log('focus')" @blur="log('blur')"/>
        </demo-row>
        <demo-row title="ColorPicker按钮形式">
            <pl-color-picker v-model="val[3]" type="button"/>
        </demo-row>
        <demo-row title="自定义内容">
            <pl-color-picker v-model="val[3]">
                <template v-slot="{color,onClick}">
                    <div :style="`display:inline-flex;height:30px;width:30px;align-items:center;justify-content:center;border:solid 1px #eee; color:${color}`" @click="onClick">
                        <pl-icon icon="el-icon-folder-s"/>
                    </div>
                </template>
            </pl-color-picker>
        </demo-row>
        <demo-row title="ColorPicker；禁用透明度，使用十六进制颜色值">
            <pl-color-picker v-model="val[4]" :enableAlpha="false"/>
            <pl-color-picker v-model="val[4]" :enableAlpha="false"/>
        </demo-row>
        <demo-row title="禁用以及只读">
            <demo-line>
                <pl-checkbox v-model="val[5]" label="是否禁用/只读"/>
            </demo-line>
            <pl-color-picker :disabled="val[5]"/>
            <pl-color-picker :readonly="val[5]"/>
        </demo-row>
    </div>
</template>

<script>

    export default {
        name: "color-picker",
        data() {

            const serviceBasicUsage = this.$colorPicker({
                reference: () => this.$refs['serviceBasicUsage'],
                renderAttrs: {
                    onChange: val => this.$message(val)
                },
            })

            const hexValue = this.$colorPicker({
                reference: () => this.$refs['hexValue'],
                renderAttrs: {
                    onChange: val => this.$message(val),
                    modelValue: '#ff0000',
                    format: 'hex',
                },
            })
            const rgbValue = this.$colorPicker({
                reference: () => this.$refs['rgbValue'],
                renderAttrs: {
                    onChange: val => this.$message(val),
                    modelValue: 'rgb(134,74,212)',
                    format: 'rgb',
                },
            })

            const rgbWithoutOpacity = this.$colorPicker({
                reference: () => this.$refs['rgbWithoutOpacity'],
                renderAttrs: {
                    onChange: val => this.$message(val),
                    modelValue: 'rgb(134,74,212,0.5)',
                    format: 'rgb',
                },
            })

            const hexWithOpacity = this.$colorPicker({
                reference: () => this.$refs['hexWithOpacity'],
                renderAttrs: {
                    onChange: val => this.$message(val),
                    modelValue: '#00ff00',
                    format: 'hex',
                    enableAlpha: true,
                },
            })

            const rgbaWithOpacity = this.$colorPicker({
                reference: () => this.$refs['rgbaWithOpacity'],
                renderAttrs: {
                    onChange: val => this.$message(val),
                    modelValue: 'rgb(134,74,212,0.5)',
                    format: 'rgb',
                    enableAlpha: true,
                },
            })

            const saveValue = (() => {
                const option = {
                    reference: () => this.$refs['saveValue'],
                    renderAttrs: {
                        onChange: val => option.renderAttrs.modelValue = val,
                        modelValue: 'rgb(134,74,212,0.5)',
                        format: 'rgb',
                        enableAlpha: true,
                    },
                }
                return this.$colorPicker(option)
            })();

            return {
                val: {
                    0: 50,
                    1: 240,
                },
                color1: '#ee2356',
                color2: null,

                serviceBasicUsage,
                hexValue,
                rgbValue,
                rgbWithoutOpacity,
                hexWithOpacity,
                rgbaWithOpacity,
                saveValue,
            }
        },
        methods: {
            log(...args) {
                console.log(...args)
            },
        },
    }
</script>

<style lang="scss">

</style>