<template>
    <div class="demo-fillet-corner">
        <demo-row title="基本用法">
            <div style="height: 40px;display: inline-flex;align-items: stretch">
                <pl-fillet-corner top="start"/>
                <div style="height: 100%;display: inline-block;align-items: center;background-color:rgba(0,0,0,0.1);color: white;">
                    this is content
                </div>
                <pl-fillet-corner top="start" bottom="end"/>
            </div>
        </demo-row>
        <demo-row title="horizontal">
            <template v-for="top in ['start','end']">
                <template v-for="bottom in ['start','end']">
                    <demo-line :title="`top:${top},bottom:${bottom}`" :key="`top:${top},bottom:${bottom}`">
                        <div class="demo-fillet-corner-wrapper">
                            111
<!--                            <pl-fillet-corner direction="horizontal" :top="top" :bottom="bottom"/>-->
                        </div>
                    </demo-line>
                </template>
            </template>
        </demo-row>
        <demo-row title="vertical">
            <template v-for="top in ['start','end']">
                <template v-for="bottom in ['start','end']">
                    <demo-line :title="`top:${top},bottom:${bottom}`" :key="`top:${top},bottom:${bottom}`">
                        <div class="demo-fillet-corner-wrapper">
                            <pl-fillet-corner direction="vertical" :top="top" :bottom="bottom"/>
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
            background-color: #f6f6f6;
            display: inline-block;
        }
    }
</style>