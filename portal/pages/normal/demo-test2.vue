<template>
    <div class="demo-test2">
        <im-demo-row title="测试拖拽排序"></im-demo-row>
        <div>
            {{cities}}
        </div>
        <im-list @mouseleave.native="switchIndex = null">
            <im-item
                    v-for="(item,index) in cities"
                    :key="item.name"
                    class="test-item"
                    @mousedown.native="e=>pl_mousedown(e,index)"
                    @mouseenter.native="e=>pl_mouseenter(e,index)"
                    @click="pl_click(index)">
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
                    {name: '广州市'},
                    {name: '上海市'},
                    {name: '北京市'},
                    {name: '深圳市'},
                    {name: '长沙市'},
                    {name: '南京市'},
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
            /*for (let i = 0; i < 6; i++) {
                this.cities.push({name: i})
            }*/
        },
        methods: {
            pl_mousedown(e, index) {
                if (!!this.draging) return;
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
                this.$plain.$dom.disabledSelectNone()
                await this.$plain.$utils.delay(23)
                this.targetEl.style.transition = this.targetTransition
                document.body.removeChild(this.copyEl)
                this.draging = false
            },
            async pl_mouseenter(e, index) {
                if (!this.draging) return
                this.switchIndex = index
                this.switchEl = e.target
            },
            async pl_click(index) {
                /*好像不会影响点击事件*/
                console.log('click', index)
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .test-item {
            height: 36px;
            width: 150px;
            margin-bottom: 12px;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: white;
            background-color: plVar(colorPrimary);
            box-sizing: border-box;
            padding: 0 12px;
        }
    }
</style>
