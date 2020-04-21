<script>
    import {EmitMixin, RefsMixinFactory} from "../../utils/mixins";
    import {TabProps} from "./tab";
    import PlTabHorizontalGroup from "./pl-tab-horizontal-group";
    import PlTabVerticalGroup from "./pl-tab-vertical-group";

    /**
     * 负责收集plTab到tabs中，通过items传给 horizontalGroup或者verticalGroup，不负责具体的渲染逻辑
     * @author  韦胜健
     * @date    2020/4/21 11:59
     */
    export default {
        name: "pl-tab-group",
        components: {PlTabVerticalGroup, PlTabHorizontalGroup},
        mixins: [
            EmitMixin,
            RefsMixinFactory({})
        ],
        emitters: {
            emitInput: Function,
        },
        props: {
            ...TabProps,
        },
        provide() {
            return {
                plTabGroup: this,
            }
        },
        data() {
            return {
                tabs: [],
            }
        },
        render() {
            const Component = ['top', 'bottom'].indexOf(this.position) > -1 ? 'pl-tab-horizontal-group' : 'pl-tab-vertical-group'
            return (
                <div class="pl-tab-group">
                    <span ref="hide">{this.$slots.default}</span>
                    {this.tabs.length > 0 && <Component {...this.binding}/>}
                </div>
            )
        },
        computed: {
            binding() {
                const props = Object.keys(TabProps).reduce((ret, key) => {
                    ret[key] = this[key]
                    return ret
                }, {})
                props.items = this.tabs

                return {
                    props,
                    on: {
                        change(val) {
                            this.emitInput(val)
                        },
                    },
                }
            },
        },
        methods: {
            addItem(item) {
                const $el = item.$el
                const children = Array.from(item.$el.parentNode.childNodes)
                const index = children.indexOf($el)
                item.index = index
                this.tabs.splice(index, 0, item)
            },
            removeItem(item) {
                this.tabs.splice(this.tabs.indexOf(item), 1)
            },
        },

    }
</script>