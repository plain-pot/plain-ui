<template>
    <pl-radio
            :color="color"
            :size="size"
            :label="label"
            is-check-all-radio id="PL-CHECK-ALL"
            :inactive-icon="p_activeIcon"
            :active-icon="p_activeIcon"
            class="pl-check-all"
            @click="$emit('click')"
    />
</template>

<script>
    import PlRadio from "./pl-radio";

    export default {
        name: "pl-check-all",
        components: {PlRadio},
        props: {
            color: {type: String,},                             //颜色：primary|success|warn|error|info
            size: {type: String,},                              //大小：large|default|small
            label: {type: String, default: '全选'},              //文本
            status: {type: String, default: 'none'},            //当前全选状态
        },
        watch: {
            status(val) {
                switch (val) {
                    case 'all':
                        this.$emit('select-all')
                        break;
                    case 'some':
                        this.$emit('select-some')
                        break;
                    case 'none':
                        this.$emit('select-none')
                        break;
                }
            },
        },
        data() {
            return {
                STATUS: {
                    'all': 'pad-check-square-fill',
                    'some': 'pad-minus-square-fill',
                    'none': 'pl-square',
                },
            }
        },
        computed: {
            p_activeIcon() {
                return this.STATUS[this.status]
            },
        },
        methods: {}
    }
</script>