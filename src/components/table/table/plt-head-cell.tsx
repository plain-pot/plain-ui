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

                const cell = e.currentTarget
                const table = this.plTable.$el

                const {left, width} = cell.getBoundingClientRect()
                const {top, height} = table.getBoundingClientRect()

                Object.assign(this.indicatorEl.style, {
                    display: 'inline-block',
                    zIndex: 9999,
                    position: 'fixed',

                    width: `${width}px`,
                    backgroundColor: '#ddd',
                    height: `${height}px`,
                    top: `${top}px`,
                    left: `${left}px`,
                })

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

                this.plc.setDurWidth(durX)
                this.plTable.refreshPlcWidth()
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