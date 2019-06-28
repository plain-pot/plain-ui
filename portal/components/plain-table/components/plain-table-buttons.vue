<template>
    <div class="plain-table-buttons">

        <div v-show="status === 'insert'">
            <pl-button label="取消" type="line" @click="pl_click('cancelInsert')" icon="pad-close"/>
            <pl-button-group>
                <pl-button label="保存" @click="pl_click('saveInsert')" icon="pad-save"/>
                <pl-button label="继续新建" @click="pl_click('continueInsert')" icon="pad-plus-circle"/>
                <pl-button label="保存并新建" @click="pl_click('nextInsert')" icon="pad-file-add"/>
            </pl-button-group>
        </div>
        <div v-show="status === 'update'">
            <pl-button label="取消" type="line" @click="pl_click('cancelUpdate')"/>
            <pl-button label="保存" @click="pl_click('saveUpdate')"/>
        </div>
        <div v-show="status === 'select'">
            <pl-button label="取消" type="line" @click="pl_click('cancelSelect')"/>
            <pl-button label="保存" @click="pl_click('confirmSelect')"/>
        </div>
        <div v-show="status === 'normal'">
            <slot></slot>
            <pl-button-group>
                <pl-button v-for="(button,index) in outerButtons" :key="index" :label="button.label" :icon="button.icon" @click="button.handler" :disabled="button.disabled()"
                           :display="button.display()"/>
            </pl-button-group>
            <pl-dropdown :popover="{popper:{height:null,width:100,align:'end',disabledEqual:true}}">
                <pl-button label="更多" icon="pl-down" rightIcon/>
                <div slot="popper" class="plain-table-buttons-more-popper">
                    <pl-dropdown-item v-for="(button,index) in innerButtons" :key="index" :label="button.label" :icon="button.icon" @click="button.handler"/>
                </div>
            </pl-dropdown>
        </div>
    </div>
</template>

<script>

    import {DEFAULT_BUTTON_ORDER} from "./plain-table-buttons";

    export default {
        name: "plain-table-buttons",
        props: {
            status: {type: String, required: true},
            buttons: {type: Array},
        },
        methods: {
            pl_click(event) {
                this.$emit(event)
            },
        },
        computed: {
            innerButtons() {
                if (!this.buttons) return
                return this.buttons.filter(btn => !!btn.inner).sort((a, b) => {
                    const ao = a.order || DEFAULT_BUTTON_ORDER[a.type]
                    const bo = b.order || DEFAULT_BUTTON_ORDER[b.type]
                    return bo - ao
                })
            },
            outerButtons() {
                if (!this.buttons) return
                return this.buttons.filter(btn => !btn.inner).sort((a, b) => {
                    const ao = a.order || DEFAULT_BUTTON_ORDER[a.type]
                    const bo = b.order || DEFAULT_BUTTON_ORDER[b.type]
                    return bo - ao
                })
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .plain-table-buttons {
            & > div > * {
                margin-left: plVar(padding);
            }
        }

        .plain-table-buttons-more-popper {
            .pl-dropdown-item-content {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>
