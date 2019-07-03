<template>
    <div class="pl-address-modal-item">
        <div class="pl-address-modal-item-title">
            <div class="pl-address-modal-item-title-left"></div>
            <span>{{title}}</span>
            <div class="pl-address-modal-item-title-right"></div>
        </div>
        <pl-justify :data="list" labelKey="name" valueKey="code" @click="pl_click" @dblclick="pl_dblclick" :value="value"/>
    </div>
</template>

<script>
    import PlJustify from "../justify/pl-justify";

    export default {
        name: "pl-address-modal-item",
        components: {PlJustify},
        props: {
            type: {},
            parentCode: {},
            value: {},
        },
        data() {
            return {
                list: [],
            }
        },
        async created() {
            if (this.type === 'province') {
                this.list = await this.$address.getByParent(null)
            }
        },
        watch: {
            async parentCode(val) {
                if (this.type !== 'province') {
                    if (!!val) {
                        this.list = await this.$address.getByParent({code: val, deep: this.type === 'city' ? 0 : 1});
                    } else {
                        this.list = null
                    }
                }
            },
        },
        computed: {
            title() {
                return this.$address.titleMap[this.type]
            },
        },
        methods: {
            pl_click(val) {
                this.$emit('click', {val, type: this.type})
            },
            pl_dblclick(val) {
                this.$emit('dblclick', {val, type: this.type})
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-address-modal-item {
            min-height: 100px;

            .pl-address-modal-item-title {
                color: plVar(colorPrimary);
                font-weight: bold;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                padding: 3px 9px;

                span {
                    margin-right: 12px;
                }

                .pl-address-modal-item-title-right {
                    flex: 1;
                    height: 1px;
                    border-bottom: dashed 1px #ddd;
                }
            }
        }
    }
</style>
