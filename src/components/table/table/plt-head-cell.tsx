import {getCellClass, TableComponentMixin} from "./table-utils";
import {Plc} from "../plc/plc-utils";

const DragMixin = {
    data() {
        const dragHandler = {
            mousedown: (e: any) => {
                window.addEventListener('mousemove', dragHandler.mousemove)
                window.addEventListener('mouseup', dragHandler.mouseup)
                this.$plain.enableSelectNone()
                this.startX = e.clientX

                this.indicatorEl = document.createElement('div')
                this.indicatorEl.style.width = `${e.currentTarget.offsetWidth}px`
                this.indicatorEl.style.backgroundColor = '#ddd'
                this.indicatorEl.style.zIndex = 9999
                this.indicatorEl.style.height = `${this.plTable.$el.offsetHeight}px`
                this.indicatorEl.style.display = 'inline-block'
                this.indicatorEl.style.position = 'absolute'
                this.indicatorEl.style.top = `${this.plTable.$el.getBoundingClientRect().top}px`
                this.indicatorEl.style.left = `${e.clientX - e.currentTarget.offsetWidth / 2}px`
                document.body.appendChild(this.indicatorEl)
            },
            mousemove: (e: any) => {
                this.indicatorEl.style.left = `${e.clientX}px`
            },
            mouseup: (e: any) => {
                window.removeEventListener('mousemove', dragHandler.mousemove)
                window.removeEventListener('mouseup', dragHandler.mouseup)
                this.$plain.disabledSelectNone()
                document.body.removeChild(this.indicatorEl)
                this.endX = e.clientX

                let durX = this.endX - this.startX
                let width = this.plc.props.width
                width = width + durX
                width = width > 30 ? width : 30
                this.plc.props.width = width
            },
        }

        return {
            dragHandler,
            indicatorEl: null,
            startX: null,
            endX: null,
        }
    },
}

export default {
    name: 'plt-head-cell',
    inject: {
        plTable: {default: null},
    },
    mixins: [
        TableComponentMixin,
        DragMixin,
    ],
    props: {
        plc: {type: Object},
    },
    render(h) {
        const plc = this.plc as Plc
        return (
            <th class={this.classes} colspan={plc.colspan} rowspan={plc.rowspan} style={this.styles}>
                {plc.title}
                <span class="plt-head-cell-indicator" onMousedown={this.dragHandler.mousedown}/>
            </th>
        )
    },
    computed: {
        classes() {
            return [
                'plt-head-cell',
                'plt-cell',
                ...getCellClass(this, this.plc, this.rowData),
            ]
        },
        styles() {
            const height = `${this.plTable.headRowHeight}px`
            const width = `${this.plc.props.width}px`
            return {
                height,
                width,
            }
        },
    },
}