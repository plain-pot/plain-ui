<template>
    <div class="demo-test2">
        <im-demo-row title="测试拖拽排序"></im-demo-row>
        <im-list>
            <im-item v-for="(item,index) in cities"
                     :key="item.name"
                     class="test-item"
                     @mousedown.native="e=>pl_mousedown(e,index)"
                     @mouseenter.native="pl_mouseenter(index)">
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
                copy: null,
                startX: null,
                startY: null,
                left: null,
                top: null,
                dragIndex: null,
            }
        },
        mounted() {
            for (let i = 0; i < 20; i++) {
                this.cities.push({name: this.$plain.$utils.uuid()})
            }
        },
        methods: {
            pl_mousedown(e, index) {
                const origin = e.target
                const {top, left} = origin.getBoundingClientRect()
                const copy = origin.cloneNode(true)
                this.dragIndex = index
                this.copy = copy
                this.startX = e.clientX
                this.startY = e.clientY
                this.top = top
                this.left = left

                copy.style.position = 'fixed'
                copy.style.left = this.left + 'px'
                copy.style.top = this.top + 'px'
                copy.style.transition = 'initial'
                copy.style.opacity = '0.5'
                copy.style.pointerEvents = 'none'
                copy.zIndex = 9999
                document.body.append(copy)
                window.addEventListener('mousemove', this.pl_mousemove)
                window.addEventListener('mouseup', this.pl_mouseup)
                this.$plain.$dom.enableSelectNone()
            },
            pl_mousemove(e) {
                const durx = e.clientX - this.startX
                const dury = e.clientY - this.startY
                this.copy.style.left = (this.left + durx) + 'px'
                this.copy.style.top = (this.top + dury) + 'px'
            },
            pl_mouseup() {
                this.dragIndex = null
                document.body.removeChild(this.copy)
                window.removeEventListener('mousemove', this.pl_mousemove)
                window.removeEventListener('mousemove', this.pl_mousemove)
                this.$plain.$dom.disabledSelectNone()
            },
            async pl_mouseenter(index) {
                if (this.dragIndex == null) return
                else {
                    console.log('switch')
                    this.cities[this.dragIndex] = this.cities.splice(index, 1, this.cities[this.dragIndex])[0];
                    await this.$plain.nextTick()
                    this.dragIndex = index
                }
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
        }
    }
</style>
