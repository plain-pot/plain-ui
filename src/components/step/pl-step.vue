<template>
    <div class="pl-step" :class="classes">
        <div class="pl-step-head">
            <span class="pl-step-divider pl-step-divider-prev" v-if="plStepGroup.titleAlignBottom || isLast"/>
            <span class="pl-step-icon">
                <template v-if="!!p_icon">
                    <pl-icon :icon="p_icon" v-if="currentStatus !== 'process'"/>
                    <pl-loading v-else type="delta"/>
                </template>
                <span class="pl-step-number" v-else>
                    <pl-icon v-if="currentStatus === STATUS.finish" icon="el-icon-check"/>
                    <pl-icon v-else-if="currentStatus === STATUS.error" icon="el-icon-close"/>
                    <span v-else>{{index}}</span>
                </span>
            </span>
            <span class="pl-step-title" v-if="!plStepGroup.titleAlignBottom">
                {{p_title}}
            </span>
            <span class="pl-step-divider pl-step-divider-next" v-if="plStepGroup.titleAlignBottom || !isLast"/>
        </div>
        <div class="pl-step-body">
            <span class="pl-step-icon" v-if="!plStepGroup.titleAlignBottom"></span>
            <span class="pl-step-title" v-else>
                {{p_title}}
            </span>
            <span class="pl-step-content">
                {{p_content}}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import {PropsMixinFactory} from "../../utils/mixins";

    /**
     * v-if会触发created，会重新刷新index，但是v-show不会，暂时不管v-show
     * @author  韦胜健
     * @date    2020/4/3 10:39
     */

    /*节点状态类型*/
    enum STATUS {
        wait = 'wait',
        finish = 'finish',
        process = 'process',
        error = 'error',
    }

    export default {
        name: "pl-step",
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
            val: {type: String},
        },
        data() {

            /*当前步骤在dom节点中的索引*/
            const index: number = null

            return {
                index,
                STATUS,
            }
        },
        created() {
            this.plStepGroup.addItem(this)
        },
        beforeDestroy() {
            this.plStepGroup.removeItem(this)
        },
        computed: {
            p_icon(): string {
                if (!!this.icon) return this.icon
                return null
            },
            isLast(): boolean {
                return this.index === this.plStepGroup.items.length
            },
            isFirst(): boolean {
                return this.index === 1
            },
            classes() {
                return [
                    `pl-step-status-${this.currentStatus}`,
                    {
                        'pl-step-has-icon': !!this.p_icon,
                        'pl-step-last': !!this.isLast,
                    }
                ]
            },
            currentStatus(): STATUS {
                if (!!this.status) return this.status
                if (this.plStepGroup.currentIndex > this.index) {
                    return STATUS.finish
                } else if (this.plStepGroup.currentIndex === this.index) {
                    if (!!this.plStepGroup.currentStatus) {
                        return this.plStepGroup.currentStatus
                    } else {
                        return STATUS.process
                    }
                } else if (this.plStepGroup.currentIndex < this.index) {
                    return STATUS.wait
                }
            },
        },
        methods: {
            /*---------------------------------------utils-------------------------------------------*/
            async refreshIndex() {
                await this.$plain.nextTick()
                // @ts-ignore
                this.index = Array.from(this.$el.parentNode.childNodes).filter(item => item.nodeName !== '#comment' && item.style.display !== 'none').indexOf(this.$el) + 1
            },
        },
    }
</script>

<style lang="scss">
</style>