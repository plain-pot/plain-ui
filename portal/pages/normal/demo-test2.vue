<template>
    <div class="demo-test2">
        <im-demo-row title="测试拖拽排序"></im-demo-row>
        [{{switchIndex}}]--[{{targetIndex}}]
        <im-list @mouseleave.native="switchIndex = null">
            <im-item
                    v-for="(item,index) in cities"
                    :key="item.name"
                    class="test-item"
                    @mousedown.native="e=>pl_mousedown(e,index)"
                    @mouseenter.native="e=>pl_mouseenter(e,index)">
                {{item.name}}
            </im-item>
        </im-list>
    </div>
</template>

<script>

    export default {
        name: "demo-test2",
        data() {
            return {
                cities: [
                    /*   {name: '广州市'},
                       {name: '上海市'},
                       {name: '北京市'},
                       {name: '深圳市'},
                       {name: '长沙市'},
                       {name: '南京市'},*/
                ],

                targetEl: null,
                copyEl: null,
                switchEl: null,
                targetIndex: null,
                switchIndex: null,
                targetTransition: null,
                startX: null,
                startY: null,
                left: null,
                top: null,
                draging: false,
            }
        },
        mounted() {
            for (let i = 0; i < 20; i++) {
                this.cities.push({name: i})
            }
        },
        methods: {
            pl_mousedown(e, index) {
                if (e.button !== 0) return
                this.draging = true

                this.targetEl = e.target
                this.copyEl = this.targetEl.cloneNode(true)
                const {top, left} = this.targetEl.getBoundingClientRect()
                this.targetIndex = index
                this.startX = e.clientX
                this.startY = e.clientY
                this.top = top
                this.left = left

                this.targetTransition = this.targetEl.style.transition
                this.targetEl.style.transition = 'none'
                this.targetEl.style.opacity = '0'

                this.copyEl.style.position = 'fixed'
                this.copyEl.style.left = this.left + 'px'
                this.copyEl.style.top = this.top + 'px'
                this.copyEl.style.transition = 'initial'
                this.copyEl.style.pointerEvents = 'none'
                this.copyEl.zIndex = 9999
                document.body.append(this.copyEl)
                window.addEventListener('mousemove', this.pl_mousemove)
                window.addEventListener('mouseup', this.pl_mouseup)
                this.$plain.$dom.enableSelectNone()
            },
            pl_mousemove(e) {
                this.copyEl.style.left = (this.left + e.clientX - this.startX) + 'px'
                this.copyEl.style.top = (this.top + e.clientY - this.startY) + 'px'
            },
            async pl_mouseup() {
                this.draging = false
                window.removeEventListener('mousemove', this.pl_mousemove)
                window.removeEventListener('mouseup', this.pl_mouseup)

                this.copyEl.style.transition = 'all 0.15s linear'
                if (this.switchIndex == null || this.switchIndex === this.targetIndex) {
                    this.copyEl.style.left = this.left + 'px'
                    this.copyEl.style.top = this.top + 'px'
                } else {
                    const {top, left} = this.switchEl.getBoundingClientRect()
                    this.copyEl.style.left = left + 'px'
                    this.copyEl.style.top = top + 'px'
                    this.cities[this.targetIndex] = this.cities.splice(this.switchIndex, 1, this.cities[this.targetIndex])[0];
                }
                await this.$plain.$utils.delay(150)
                this.targetIndex = null
                this.switchIndex = null
                this.switchEl = null

                this.targetEl.style.opacity = null
                await this.$plain.nextTick()
                this.targetEl.style.transition = this.targetTransition
                this.$plain.$dom.disabledSelectNone()
                document.body.removeChild(this.copyEl)
            },
            async pl_mouseenter(e, index) {
                if (!this.draging) return
                this.switchIndex = index
                this.switchEl = e.target
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .test-item {
            height: 120px;
            width: 200px;
            margin-bottom: 12px;
            margin-right: 12px;
            border-radius: 4px;
            padding: 12px;
            color: white;
            background-color: plVar(colorPrimary);
            display: inline-block !important;
            border: solid 1px plVar(colorPrimaryDeep);
            box-sizing: border-box;
        }
    }
</style>
