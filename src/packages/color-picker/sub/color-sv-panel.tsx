import {defineComponent} from "@vue/composition-api";
import {useProps} from "@/use/useProps";

export default defineComponent({
    name: 'pl-color-sv-panel',
    props: {
        hue: {type: Number, default: 360},                      // 色相
        saturation: {type: Number},                             // 饱和度
        value: {type: Number},                                  // 亮度

        height: {type: [String, Number], default: 180},         // 面板高度
        width: {type: [String, Number], default: 240},          // 面板宽度
    },
    setup(props) {


        const propsState = useProps(props,{

        })

        return () => (
            <div>

            </div>
        )
    },
})