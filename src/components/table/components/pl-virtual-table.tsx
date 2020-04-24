import {RefsMixinFactory} from "../../../utils/mixins";
import virtualList from '../../virtual-list/pl-virtual-list.vue'

const VirtualList = virtualList as any

export default {
    name: 'pl-virtual-table',
    props: {
        data: {type: Array},
        size: {type: Number},
        width: {type: Number},

        remain: {type: Number},
        dynamicSize: {type: Number},
    },
    mixins: [
        RefsMixinFactory({
            scroll: Object,
        })
    ],
    watch: {
        ...VirtualList.watch,
    },
    data: VirtualList.data,
    updated: VirtualList.updated,
    computed: {
        ...VirtualList.computed,
    },
    methods: {
        ...VirtualList.methods,
    },
    render(h) {
        return (
            <div class="pl-virtual-table">
                <pl-scroll ref="scroll" onScroll={this.onScroll} scrollX={true}>
                    <div class="pl-virtual-table-strut" style={{...this.strutStyles, width: `${this.width}px`}}>
                        <div class="pl-virtual-table-content" style={this.contentStyles}>
                            <pl-list tag="table" cellspacing={0} cellpadding={0} border={0} style={{width: `${this.width}px`}}>
                                {this.targetData.map(({item, index}) => !this.$scopedSlots.default ? null : this.$scopedSlots.default({item, index}))}
                            </pl-list>
                        </div>
                    </div>
                </pl-scroll>
            </div>
        )
    },
}