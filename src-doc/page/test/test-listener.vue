<template>
    <div class="test-listener">
        <demo-row title="onListeners">
            <demo-line v-for="(value,key) in onListeners" :key="key" :title="key">
                <pl-button-group>
                    <pl-button label="off" v-for="(cb,index) in value" :key="index" @click="off[key](cb)"/>
                </pl-button-group>
            </demo-line>
        </demo-row>
        <demo-row title="onceListeners">
            <demo-line v-for="(value,key) in onceListeners" :key="key" :title="key">
                <pl-button-group>
                    <pl-button label="off" v-for="(cb,index) in value" :key="index" @click="off[key](cb)"/>
                </pl-button-group>
            </demo-line>
        </demo-row>
        <demo-row title="操作">
            <demo-line v-for="key in ['show','hide','clickRow']" :key="key" :title="key">
                <pl-button-group>
                    <pl-button label="监听事件" @click="on[key]((...args)=>$plain.$message(JSON.stringify(args)))"/>
                    <pl-button label="监听一次事件" @click="once[key]((...args)=>$plain.$message(JSON.stringify(args)))"/>
                    <pl-button label="派发事件" @click="emit[key](123)"/>
                    <pl-button label="监听事件，2s之后自动注销监听" @click="customListen(key)"/>
                </pl-button-group>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>

    import {EmitFunc, useEvent} from "../../../src/use/useEvent";

    export default {
        name: "test-listener",
        setup(props, context) {
            const {emit, on, once, off, onListeners, onceListeners} = useEvent({
                show: EmitFunc,
                hide: EmitFunc,
                clickRow: (row, rowIndex) => undefined
            })

            return {
                emit, on, once, off, onListeners, onceListeners,

                customListen(key) {
                    const cancel = on[key]((...args) => {
                        this.$plain.$message(JSON.stringify(args))
                    })
                    setTimeout(() => {
                        cancel()
                    }, 2000)
                },
            }
        },
    }
</script>

<style lang="scss">

</style>