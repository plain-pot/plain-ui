<template>
    <div class="demo-fillet-corner">
        <demo-row title="horizontal">

            <template v-for="top in ['start','end']">
                <template v-for="bottom in ['start','end']">
                    <demo-line :title="`top:${top},bottom:${bottom}`" :key="`top:${top},bottom:${bottom}`">
                        <div class="demo-fillet-corner-wrapper">
                            <pl-fillet-corner direction="horizontal" :top="top" :bottom="bottom"/>
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
        }
    }
</style>