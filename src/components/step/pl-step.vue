<template>
    <div class="pl-step">
        <div class="pl-step-icon">
            <pl-step-number>
                {{index}}
            </pl-step-number>
        </div>
        <dov class="pl-step-icon">
            <pl-icon :icon="icon"/>
        </dov>
        <div class="pl-step-body">
            <div class="pl-step-title">
                {{p_title}}
            </div>
            <div class="pl-step-content">

            </div>
        </div>
    </div>
</template>

<script>
    import {PropsMixinFactory} from "../../utils/mixins";
    import PlStepNumber from "./pl-step-number";

    /**
     * v-if会触发created，会重新刷新index，但是v-show不会，暂时不管v-show
     * @author  韦胜健
     * @date    2020/4/3 10:39
     */

    export default {
        name: "pl-step",
        components: {PlStepNumber},
        inject: {
            plStepGroup: {},
        },
        mixins: [
            PropsMixinFactory.create({
                title: PropsMixinFactory.Promise,
                subTitle: PropsMixinFactory.Promise,
                content: PropsMixinFactory.Promise,
            })
        ],
        props: {
            icon: {type: String},
            status: {type: String},
            title: {type: [String, Object]},
            subTitle: {type: [String, Object]},
            content: {type: [String, Object]},
        },
        data() {
            return {
                index: null,
            }
        },
        created() {
            this.plStepGroup.addItem(this)
        },
        beforeDestroy() {
            this.plStepGroup.removeItem(this)
        },
        methods: {
            /*---------------------------------------utils-------------------------------------------*/
            async refreshIndex() {
                await this.$plain.nextTick()
                this.index = Array.from(this.$el.parentNode.childNodes).filter(item => item.nodeName !== '#comment' && item.style.display !== 'none').indexOf(this.$el) + 1
            },
        },
    }
</script>

<style lang="scss">
</style>