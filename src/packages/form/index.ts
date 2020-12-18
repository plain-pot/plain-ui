import form from './form'
import item from './form-item'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

const FormItem = createComponentPlugin(item)

export default createComponentPlugin(form, {
    exposeComponents: {FormItem}
})