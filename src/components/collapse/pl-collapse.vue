<template>
    <div class="pl-collapse" :class="{'pl-collapse-active':p_value}">
        <div class="pl-collapse-head" @click="onClickHeader">
            <slot name="head">
                <span v-if="!!title">{{title}}</span>
            </slot>
            <div class="pl-collapse-head-icon-wrapper" v-if="!noIcon">
                <pl-icon icon="el-icon-arrow-down" :color="iconColor"/>
            </div>
        </div>
        <pl-collapse-transition>
            <div class="pl-collapse-body" v-show="p_value">
                <slot>
                    BODY
                </slot>
            </div>
        </pl-collapse-transition>
    </div>
</template>

<script>


    import PlCollapseTransition from "./pl-collapse-transition";
    import {EmitMixin} from "../../utils/mixins";

    export default {
        name: 'pl-collapse',
        components: {
            PlCollapseTransition
        },
        inject: {
            plCollapseGroup: {default: null}
        },
        mixins: [
            EmitMixin,
        ],
        emitters: {
            emitOpen: Function,
            emitClose: Function,
            emitInput: Function,
            emitClickHeader: Function
        },
        props: {
            title: {},
            value: {type: Boolean},
            noIcon: {type: Boolean},
            iconColor: {type: String},
            disabledClickHead: {type: Boolean},
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        data() {
            return {
                p_value: this.value,
            };
        },
        created() {
            if (!!this.plCollapseGroup) {
                this.plCollapseGroup.addItem(this)
            }
        },
        beforeDestroy() {
            if (!!this.plCollapseGroup) {
                this.plCollapseGroup.removeItem(this)
            }
        },
        methods: {
            open() {
                if (this.p_value) return
                this.p_value = true
                this.emitInput(this.p_value)
                this.emitOpen()
            },
            close() {
                if (!this.p_value) return
                this.p_value = false
                this.emitInput(this.p_value)
                this.emitClose()
            },
            toggle() {
                if (this.p_value) {
                    this.close()
                } else {
                    this.open()
                }
            },
            onClickHeader() {
                if (this.disabledClickHead) return
                this.emitClickHeader()
                if (!!this.plCollapseGroup) {
                    this.plCollapseGroup.onClickItem(this)
                } else {
                    this.toggle()
                }
            },
        },

    };
</script>