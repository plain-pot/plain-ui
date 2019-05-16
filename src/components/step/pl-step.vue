<template>
    <div class="pl-step" :class="classes">
        <div class="pl-step-icon-wrapper">
            <div class="pl-step-icon-content">
                <pl-icon icon="pad-close-circle-fill" v-if="status === 'error'"/>
                <pl-icon icon="pad-check-circle-fill" v-else-if="status === 'success'"/>
                <pl-icon :icon="icon" v-else-if="!!icon"/>
                <div class="pl-step-number" v-else-if="p_index!=null">
                    {{p_index+1}}
                </div>
            </div>
            <div class="pl-step-title-line" v-if="!!p_container && p_container.vertical && (p_container.reverse?!isFirst:!isLast)"></div>
        </div>
        <div class="pl-step-body">
            <div class="pl-step-title-wrapper">
                <div class="pl-step-title">
                    <slot name="title">
                        {{title}}
                    </slot>
                </div>
                <div class="pl-step-title-line" v-if="!isLast && !!p_container && !p_container.vertical"></div>
            </div>
            <div class="pl-step-content">
                <slot name="content">
                    {{content}}
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-step",
        components: {PlIcon},
        props: {
            icon: {type: String,},
            title: {type: String,},
            content: {type: String,},
            status: {type: String},
        },
        data() {
            return {
                p_container: null,
                p_index: null,
            }
        },
        computed: {
            isLast() {
                if (!this.p_container) return false
                return this.p_index === this.p_container.items.length - 1
            },
            isFirst() {
                return this.p_index === 0
            },
            isActive() {
                if (!this.p_container) return false
                return this.p_index === this.p_container.value
            },
            isComplete() {
                if (!this.p_container) return false
                return this.p_index < this.p_container.value
            },
            classes() {
                return [
                    {
                        'pl-step-active': this.isActive,
                        'pl-step-complete': this.isComplete,
                        'pl-step-status-success': this.status === 'success',
                        'pl-step-status-error': this.status === 'error',
                    }
                ]
            },
        },
        created() {
            this.p_container = this.$plain.$dom.findComponentUpward(this, 'pl-step-container')
            if (!this.p_container) {
                console.log(`can't find container!`)
                return
            } else {
                this.p_container.pl_add(this)
            }
        },
        beforeDestroy() {
            !!this.p_container && this.p_container.pl_remove(this)
        }

    }
</script>

<style lang="scss">

</style>