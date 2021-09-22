import {createUseEditPopperAgent} from "../useEditPopperAgent/createAgentGetter";
import PlColorPanel from "../PlColorPicker/PlColorPanel";


export const useColorPicker = createUseEditPopperAgent({
    name: 'color-picker',
    render(attrs: any) {
        return <PlColorPanel {...attrs}/>
    },
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
    defaultRenderAttrs: {
        onChange() {this.hide()},
    },
})

export default useColorPicker
