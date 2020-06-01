<template>
    <div class="demo-fillet-corner">
        <demo-row title="基本用法">
            <div style="height: 40px;display: inline-flex;align-items: stretch">
                <pl-fillet-corner top start/>
                <div style="height: 100%;display: inline-flex;align-items: center;background-color:black;color: white;">
                    this is content
                </div>
                <pl-fillet-corner top/>
            </div>
        </demo-row>
        <demo-row title="horizontal">
            <template v-for="top in [true,false]">
                <template v-for="start in [true,false]">
                    <demo-line :title="`top:${top},start:${start}`" :key="`top:${top},start:${start}`">
                        <div class="demo-fillet-corner-wrapper">
                            <pl-fillet-corner direction="horizontal" :top="top" :start="start"/>
                        </div>
                    </demo-line>
                </template>
            </template>
        </demo-row>
        <demo-row title="vertical">
            <template v-for="top in [true,false]">
                <template v-for="start in [true,false]">
                    <demo-line :title="`top:${top},start:${start}`" :key="`top:${top},start:${start}`">
                        <div class="demo-fillet-corner-wrapper">
                            <pl-fillet-corner direction="vertical" :top="top" :start="start"/>
                        </div>
                    </demo-line>
                </template>
            </template>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "fillet-corner"
    }
</script>

<style lang="scss">
    .demo-fillet-corner {
        .demo-fillet-corner-wrapper {
            height: 40px;
            /*background-color: #f6f6f6;*/
            display: inline-block;
        }
    }
</style>