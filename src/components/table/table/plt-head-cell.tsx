import {getCellClass, TableComponentMixin} from "./table-utils";
import {Plc} from "../plc/plc-utils";

const ResizeMixin = {
    data() {
        const resize = {
            indicatorEl: null,
            startX: null,
            endX: null,
            handler: {
                mousedown: (e: any) => {
                    e.preventDefault()
                    e.stopPropagation()

                    window.addEventListener('mousemove', resize.handler.mousemove)
                    window.addEventListener('mouseup', resize.handler.mouseup)
                    this.$plain.enableSelectNone()
                    resize.startX = e.clientX

                    resize.indicatorEl = document.createElement('div')

                    const cell = e.currentTarget
                    const table = this.plTable.$el

                    const {left, width} = cell.getBoundingClientRect()
                    const {top, height} = table.getBoundingClientRect()

                    Object.assign(resize.indicatorEl.style, {
                        display: 'inline-block',
                        zIndex: 9999,
                        position: 'fixed',

                        width: `${width}px`,
                        backgroundColor: '#ddd',
                        height: `${height}px`,
                        top: `${top}px`,
                        left: `${left}px`,
                    })

                    document.body.appendChild(resize.indicatorEl)
                },
                mousemove: (e: any) => {
                    resize.indicatorEl.style.left = `${e.clientX}px`
                },
                mouseup: (e: any) => {
                    window.removeEventListener('mousemove', resize.handler.mousemove)
                    window.removeEventListener('mouseup', resize.handler.mouseup)
                    this.$plain.disabledSelectNone()
                    document.body.removeChild(resize.indicatorEl)
                    resize.endX = e.clientX

                    let durX = resize.endX - resize.startX

                    this.plc.setDurWidth(durX)
                },
            },
        }
        return {
            resize,

        }
    },
}

export default {
    name: 'plt-head-cell',
    inject: {
        plTable: {default: null},
        pltHead: {default: null},
    },
    mixins: [
        TableComponentMixin,
        ResizeMixin,
    ],
    props: {
        plc: {type: Object},
    },
    render(h) {
        const plc = this.plc as Plc
        const {colspan, rowspan, title} = plc

        const binding = {
            class: this.classes,
            style: this.styles,
            attrs: {
                colspan,
                rowspan,
                // draggable: this.pltHead.headPlcList.length > 1,
            },
        }

        return (
            <th {...binding}>
                {title}
                <span class="plt-head-cell-indicator" onMousedown={this.resize.handler.mousedown}/>
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
            const width = `${this.plc.actualProps.width}px`
            return {
                height,
                width,
            }
        },
    },
}